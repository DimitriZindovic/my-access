import express from "express";
import sql from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function calculateAccessibilityScore(accessibilitySpecs) {
  if (!accessibilitySpecs) {
    return { physique: 0, numerique: 0, accueil: 0 };
  }

  let physiqueScore = 0;
  let numeriqueScore = 0;
  let accueilScore = 0;
  let count = 0;

  if (accessibilitySpecs.has_ramp) physiqueScore += 1;
  if (accessibilitySpecs.has_elevator) physiqueScore += 1;
  if (accessibilitySpecs.door_width_cm && accessibilitySpecs.door_width_cm >= 80) physiqueScore += 1;
  if (accessibilitySpecs.has_braille_signage) physiqueScore += 1;
  physiqueScore = Math.min(5, (physiqueScore / 4) * 5);

  if (accessibilitySpecs.website_accessible) numeriqueScore += 2.5;
  numeriqueScore = Math.min(5, numeriqueScore);

  if (accessibilitySpecs.staff_trained) accueilScore += 2.5;
  if (accessibilitySpecs.has_quiet_zone) accueilScore += 1.25;
  if (accessibilitySpecs.has_audio_guidance) accueilScore += 1.25;
  accueilScore = Math.min(5, accueilScore);

  return {
    physique: Math.round(physiqueScore * 10) / 10,
    numerique: Math.round(numeriqueScore * 10) / 10,
    accueil: Math.round(accueilScore * 10) / 10,
  };
}

function calculateGlobalScore(accessibilityScore, avgRating) {
  const avgAccessibility =
    (accessibilityScore.physique +
      accessibilityScore.numerique +
      accessibilityScore.accueil) /
    3;
  const ratingScore = parseFloat(avgRating || 0);
  return Math.round(((avgAccessibility + ratingScore) / 2) * 10) / 10;
}

function mapCenterToFrontend(center, accessibilitySpecs, reviews) {
  const accessibilityScore = calculateAccessibilityScore(accessibilitySpecs);
  const globalScore = calculateGlobalScore(accessibilityScore, center.avg_rating);

  const addressParts = center.address.split(",");
  const cityPostal = addressParts[addressParts.length - 1]?.trim() || "";
  const [postalCode, ...cityParts] = cityPostal.split(" ").reverse();
  const city = cityParts.reverse().join(" ") || "";

  const services = [];
  if (accessibilitySpecs?.has_ramp) services.push("Rampe d'accès");
  if (accessibilitySpecs?.has_elevator) services.push("Ascenseur");
  if (accessibilitySpecs?.door_width_cm >= 80) services.push("Portes larges");
  if (accessibilitySpecs?.has_braille_signage) services.push("Signalétique braille");
  if (accessibilitySpecs?.has_audio_guidance) services.push("Guidage audio");
  if (accessibilitySpecs?.has_quiet_zone) services.push("Zone calme");
  if (accessibilitySpecs?.staff_trained) services.push("Personnel formé");
  if (accessibilitySpecs?.website_accessible) services.push("Site accessible");

  return {
    id: center.id.toString(),
    name: center.name,
    address: addressParts.slice(0, -1).join(",").trim() || center.address,
    city: city || "Paris",
    postalCode: postalCode || "",
    latitude: parseFloat(center.latitude),
    longitude: parseFloat(center.longitude),
    phone: center.phone || "",
    email: center.email || "",
    website: center.website || null,
    hours: center.hours || "Lun-Ven: 9h-18h",
    type: center.type || "both",
    accessibilityScore,
    globalScore,
    reviews: reviews || [],
    services,
  };
}

router.get("/", async (req, res) => {
  try {
    const { search, verified, limit = 50, offset = 0 } = req.query;

    let centers;

    if (verified === "true" && search) {
      centers = await sql`
        SELECT 
          c.*,
          a.*
        FROM centers c
        LEFT JOIN accessibility_specs a ON c.id = a.center_id
        WHERE c.verified_access = true
        AND (c.name ILIKE ${`%${search}%`} OR c.address ILIKE ${`%${search}%`})
        ORDER BY c.created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${parseInt(offset)}
      `;
    } else if (verified === "true") {
      centers = await sql`
        SELECT 
          c.*,
          a.*
        FROM centers c
        LEFT JOIN accessibility_specs a ON c.id = a.center_id
        WHERE c.verified_access = true
        ORDER BY c.created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${parseInt(offset)}
      `;
    } else if (search) {
      centers = await sql`
        SELECT 
          c.*,
          a.*
        FROM centers c
        LEFT JOIN accessibility_specs a ON c.id = a.center_id
        WHERE c.name ILIKE ${`%${search}%`} OR c.address ILIKE ${`%${search}%`}
        ORDER BY c.created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${parseInt(offset)}
      `;
    } else {
      centers = await sql`
        SELECT 
          c.*,
          a.*
        FROM centers c
        LEFT JOIN accessibility_specs a ON c.id = a.center_id
        ORDER BY c.created_at DESC
        LIMIT ${parseInt(limit)}
        OFFSET ${parseInt(offset)}
      `;
    }

    const centerIds = centers.map((c) => c.id);
    const reviewsQuery =
      centerIds.length > 0
        ? sql`
        SELECT 
          r.*,
          u.first_name,
          u.last_name,
          u.email
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.center_id = ANY(${centerIds})
        ORDER BY r.created_at DESC
      `
        : sql`SELECT * FROM reviews WHERE 1=0`;

    const allReviews = await reviewsQuery;
    const reviewsByCenter = {};

    for (const review of allReviews) {
      if (!reviewsByCenter[review.center_id]) {
        reviewsByCenter[review.center_id] = [];
      }
      reviewsByCenter[review.center_id].push({
        id: review.id.toString(),
        userId: review.user_id,
        userName: `${review.first_name || ""} ${review.last_name || ""}`.trim() || review.email,
        centerId: review.center_id.toString(),
        date: review.created_at.toISOString(),
        scores: {
          physique: review.rating,
          numerique: review.rating,
          accueil: review.rating,
        },
        comment: review.comment || "",
        handicapTypes: [],
        helpfulCount: 0,
      });
    }

    const mappedCenters = centers.map((center) => {
      const accessibilitySpecs = {
        has_ramp: center.has_ramp,
        has_elevator: center.has_elevator,
        door_width_cm: center.door_width_cm,
        has_braille_signage: center.has_braille_signage,
        has_audio_guidance: center.has_audio_guidance,
        has_quiet_zone: center.has_quiet_zone,
        staff_trained: center.staff_trained,
        website_accessible: center.website_accessible,
      };

      return mapCenterToFrontend(
        center,
        accessibilitySpecs,
        reviewsByCenter[center.id] || []
      );
    });

    res.json(mappedCenters);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des centres" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const centerResult = await sql`
      SELECT 
        c.*,
        a.*
      FROM centers c
      LEFT JOIN accessibility_specs a ON c.id = a.center_id
      WHERE c.id = ${parseInt(id)}
    `;

    if (centerResult.length === 0) {
      return res.status(404).json({ error: "Centre non trouvé" });
    }

    const center = centerResult[0];

    const reviewsResult = await sql`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.center_id = ${parseInt(id)}
      ORDER BY r.created_at DESC
    `;

    const reviews = reviewsResult.map((review) => ({
      id: review.id.toString(),
      userId: review.user_id,
      userName: `${review.first_name || ""} ${review.last_name || ""}`.trim() || review.email,
      centerId: review.center_id.toString(),
      date: review.created_at.toISOString(),
      scores: {
        physique: review.rating,
        numerique: review.rating,
        accueil: review.rating,
      },
      comment: review.comment || "",
      handicapTypes: [],
      helpfulCount: 0,
    }));

    const accessibilitySpecs = {
      has_ramp: center.has_ramp,
      has_elevator: center.has_elevator,
      door_width_cm: center.door_width_cm,
      has_braille_signage: center.has_braille_signage,
      has_audio_guidance: center.has_audio_guidance,
      has_quiet_zone: center.has_quiet_zone,
      staff_trained: center.staff_trained,
      website_accessible: center.website_accessible,
    };

    const mappedCenter = mapCenterToFrontend(center, accessibilitySpecs, reviews);

    res.json(mappedCenter);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du centre" });
  }
});

router.post("/:id/reviews", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating doit être entre 1 et 5" });
    }

    const centerCheck = await sql`
      SELECT id FROM centers WHERE id = ${parseInt(id)}
    `;

    if (centerCheck.length === 0) {
      return res.status(404).json({ error: "Centre non trouvé" });
    }

    const userCheck = await sql`
      SELECT id FROM users WHERE id = ${userId}
    `;

    if (userCheck.length === 0) {
      await sql`
        INSERT INTO users (id, email, first_name, last_name, handicap_type, created_at, updated_at)
        VALUES (
          ${userId},
          ${req.user.email},
          ${req.user.user_metadata?.first_name || null},
          ${req.user.user_metadata?.last_name || null},
          ${req.user.user_metadata?.handicap_type || null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          updated_at = NOW()
      `;
    }

    const reviewResult = await sql`
      INSERT INTO reviews (center_id, user_id, rating, comment, created_at, updated_at)
      VALUES (${parseInt(id)}, ${userId}, ${rating}, ${comment || null}, NOW(), NOW())
      RETURNING *
    `;

    const avgRatingResult = await sql`
      SELECT AVG(rating)::DECIMAL(3,2) as avg_rating
      FROM reviews
      WHERE center_id = ${parseInt(id)}
    `;

    await sql`
      UPDATE centers
      SET avg_rating = ${parseFloat(avgRatingResult[0].avg_rating || 0)},
          updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `;

    const userInfo = await sql`
      SELECT first_name, last_name, email FROM users WHERE id = ${userId}
    `;

    const review = {
      id: reviewResult[0].id.toString(),
      userId: reviewResult[0].user_id,
      userName:
        `${userInfo[0]?.first_name || ""} ${userInfo[0]?.last_name || ""}`.trim() ||
        userInfo[0]?.email,
      centerId: reviewResult[0].center_id.toString(),
      date: reviewResult[0].created_at.toISOString(),
      scores: {
        physique: rating,
        numerique: rating,
        accueil: rating,
      },
      comment: reviewResult[0].comment || "",
      handicapTypes: [],
      helpfulCount: 0,
    };

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'avis" });
  }
});

export default router;
