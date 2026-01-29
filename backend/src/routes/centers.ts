import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/centers - Liste des centres
router.get("/", optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { search, verified, limit = "50", offset = "0" } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { address: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (verified === "true") {
      where.verifiedAccess = true;
    }

    const centers = await prisma.center.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        accessibilitySpecs: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { avgRating: "desc" },
    });

    // Convertir BigInt en string pour JSON
    const serializedCenters = centers.map((center) => ({
      ...center,
      id: center.id.toString(),
      latitude: center.latitude.toString(),
      longitude: center.longitude.toString(),
      avgRating: center.avgRating.toString(),
      accessibilitySpecs: center.accessibilitySpecs
        ? {
            ...center.accessibilitySpecs,
            centerId: center.accessibilitySpecs.centerId.toString(),
          }
        : null,
      reviews: center.reviews.map((review) => ({
        ...review,
        id: review.id.toString(),
        centerId: review.centerId.toString(),
      })),
    }));

    return res.json(serializedCenters);
  } catch (error) {
    console.error("Erreur récupération centres:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération des centres" });
  }
});

// GET /api/centers/:id - Détail d'un centre
router.get("/:id", optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const center = await prisma.center.findUnique({
      where: { id: BigInt(id) },
      include: {
        accessibilitySpecs: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!center) {
      return res.status(404).json({ error: "Centre non trouvé" });
    }

    // Convertir BigInt en string pour JSON
    const serializedCenter = {
      ...center,
      id: center.id.toString(),
      latitude: center.latitude.toString(),
      longitude: center.longitude.toString(),
      avgRating: center.avgRating.toString(),
      accessibilitySpecs: center.accessibilitySpecs
        ? {
            ...center.accessibilitySpecs,
            centerId: center.accessibilitySpecs.centerId.toString(),
          }
        : null,
      reviews: center.reviews.map((review) => ({
        ...review,
        id: review.id.toString(),
        centerId: review.centerId.toString(),
      })),
    };

    return res.json(serializedCenter);
  } catch (error) {
    console.error("Erreur récupération centre:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération du centre" });
  }
});

// POST /api/centers/:id/reviews - Ajouter un avis
router.post("/:id/reviews", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Note invalide (1-5)" });
    }

    const review = await prisma.review.create({
      data: {
        centerId: BigInt(id),
        userId: req.user!.id,
        rating,
        comment,
      },
    });

    // Mettre à jour la note moyenne du centre
    const reviews = await prisma.review.findMany({
      where: { centerId: BigInt(id) },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.center.update({
      where: { id: BigInt(id) },
      data: { avgRating },
    });

    return res.status(201).json({
      ...review,
      id: review.id.toString(),
      centerId: review.centerId.toString(),
    });
  } catch (error) {
    console.error("Erreur ajout avis:", error);
    return res.status(500).json({ error: "Erreur lors de l'ajout de l'avis" });
  }
});

export default router;
