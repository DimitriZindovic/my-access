import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from "../middleware/auth.js";
import { Center, Review, AccessibilitySpec, User } from "@prisma/client";

const router = Router();

type CenterWithRelations = Center & {
  accessibilitySpecs: AccessibilitySpec | null;
  reviews: (Review & { user: Pick<User, "firstName" | "lastName"> })[];
};

// GET /api/centers - Liste des centres
router.get("/", optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, verified, limit = "50", offset = "0" } = req.query;

    const where: {
      OR?: { name?: { contains: string; mode: "insensitive" }; address?: { contains: string; mode: "insensitive" } }[];
      verifiedAccess?: boolean;
    } = {};

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
    const serializedCenters = centers.map((center: CenterWithRelations) => ({
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

    res.json(serializedCenters);
  } catch (error) {
    console.error("Erreur récupération centres:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des centres" });
  }
});

// GET /api/centers/:id - Détail d'un centre
router.get("/:id", optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

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
      res.status(404).json({ error: "Centre non trouvé" });
      return;
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

    res.json(serializedCenter);
  } catch (error) {
    console.error("Erreur récupération centre:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du centre" });
  }
});

// POST /api/centers/:id/reviews - Ajouter un avis
router.post("/:id/reviews", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Note invalide (1-5)" });
      return;
    }

    const centerId = BigInt(id);

    const review = await prisma.review.create({
      data: {
        centerId,
        userId: req.user!.id,
        rating,
        comment,
      },
    });

    // Mettre à jour la note moyenne du centre
    const reviews = await prisma.review.findMany({
      where: { centerId },
    });

    const avgRating =
      reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length;

    await prisma.center.update({
      where: { id: centerId },
      data: { avgRating },
    });

    res.status(201).json({
      ...review,
      id: review.id.toString(),
      centerId: review.centerId.toString(),
    });
  } catch (error) {
    console.error("Erreur ajout avis:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'avis" });
  }
});

export default router;
