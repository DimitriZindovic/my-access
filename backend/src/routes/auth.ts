import { Router, Request, Response } from "express";
import { supabaseAdmin, supabase } from "../lib/supabase";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/auth/signup - Inscription
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, handicapType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirmer l'email en dev
      });

    if (authError) {
      console.error("Erreur Supabase Auth:", authError);
      if (authError.message.includes("already registered")) {
        return res.status(400).json({ error: "Cet email est déjà utilisé" });
      }
      return res.status(400).json({ error: authError.message });
    }

    // Créer le profil utilisateur dans la DB
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        handicapType: handicapType || null,
      },
    });

    // Connecter l'utilisateur immédiatement
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return res.status(201).json({
        message: "Compte créé avec succès. Veuillez vous connecter.",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          handicapType: user.handicapType,
        },
      });
    }

    return res.status(201).json({
      message: "Compte créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        handicapType: user.handicapType,
      },
      session: {
        accessToken: signInData.session?.access_token,
        refreshToken: signInData.session?.refresh_token,
        expiresAt: signInData.session?.expires_at,
      },
    });
  } catch (error) {
    console.error("Erreur inscription:", error);
    return res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// POST /api/auth/login - Connexion
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur de connexion:", error);
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Récupérer le profil utilisateur depuis la DB
    let user = await prisma.user.findUnique({
      where: { id: data.user.id },
    });

    // Si l'utilisateur n'existe pas dans la DB, le créer
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
        },
      });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        handicapType: user.handicapType,
      },
      session: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at,
      },
    });
  } catch (error) {
    console.error("Erreur connexion:", error);
    return res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// POST /api/auth/logout - Déconnexion
router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      await supabase.auth.signOut();
    }

    return res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur déconnexion:", error);
    return res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
});

// GET /api/auth/me - Obtenir l'utilisateur courant
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      handicapType: user.handicapType,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Erreur récupération profil:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
});

// PUT /api/auth/me - Mettre à jour le profil
router.put("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, handicapType, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        handicapType,
        phone,
      },
    });

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      handicapType: user.handicapType,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
});

// POST /api/auth/refresh - Rafraîchir le token
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token requis" });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    return res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresAt: data.session?.expires_at,
    });
  } catch (error) {
    console.error("Erreur rafraîchissement token:", error);
    return res.status(500).json({ error: "Erreur lors du rafraîchissement du token" });
  }
});

export default router;
