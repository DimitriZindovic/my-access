import express from "express";
import { supabaseAdmin, supabase } from "../config/supabase.js";
import { authenticateToken } from "../middleware/auth.js";
import sql from "../config/db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName, handicapType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || null,
            last_name: lastName || null,
            handicap_type: handicapType || null,
          },
        },
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res
        .status(400)
        .json({ error: "Erreur lors de la création du compte" });
    }

    let session = null;
    if (authData.session) {
      session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt:
          authData.session.expires_at ||
          Math.floor(Date.now() / 1000) + 3600,
      };
    }

    const user = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: authData.user.user_metadata?.first_name || null,
      lastName: authData.user.user_metadata?.last_name || null,
      handicapType: authData.user.user_metadata?.handicap_type || null,
    };

    try {
      await sql`
        INSERT INTO users (id, email, first_name, last_name, handicap_type, created_at, updated_at)
        VALUES (
          ${authData.user.id},
          ${authData.user.email},
          ${authData.user.user_metadata?.first_name || null},
          ${authData.user.user_metadata?.last_name || null},
          ${authData.user.user_metadata?.handicap_type || null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          updated_at = NOW()
      `;
    } catch (dbError) {
      console.error("Erreur synchronisation DB:", dbError);
    }

    res.status(201).json({
      message: "Compte créé avec succès",
      user,
      session,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    if (!authData.user || !authData.session) {
      return res.status(401).json({ error: "Erreur lors de la connexion" });
    }

    const session = {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt:
        authData.session.expires_at || Math.floor(Date.now() / 1000) + 3600,
    };

    const user = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: authData.user.user_metadata?.first_name || null,
      lastName: authData.user.user_metadata?.last_name || null,
      handicapType: authData.user.user_metadata?.handicap_type || null,
    };

    try {
      await sql`
        INSERT INTO users (id, email, first_name, last_name, handicap_type, created_at, updated_at)
        VALUES (
          ${authData.user.id},
          ${authData.user.email},
          ${authData.user.user_metadata?.first_name || null},
          ${authData.user.user_metadata?.last_name || null},
          ${authData.user.user_metadata?.handicap_type || null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          updated_at = NOW()
      `;
    } catch (dbError) {
      console.error("Erreur synchronisation DB:", dbError);
    }

    res.json({
      user,
      session,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await supabaseAdmin.auth.signOut({ refreshToken });
    }

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const dbUser = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    if (dbUser.length > 0) {
      const user = {
        id: dbUser[0].id,
        email: dbUser[0].email,
        firstName: dbUser[0].first_name,
        lastName: dbUser[0].last_name,
        handicapType: dbUser[0].handicap_type,
        createdAt: dbUser[0].created_at.toISOString(),
      };
      return res.json(user);
    }

    const { data: userData, error } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !userData.user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = {
      id: userData.user.id,
      email: userData.user.email,
      firstName: userData.user.user_metadata?.first_name || null,
      lastName: userData.user.user_metadata?.last_name || null,
      handicapType: userData.user.user_metadata?.handicap_type || null,
      createdAt: userData.user.created_at,
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, handicapType, phone } = req.body;

    const updates = {};
    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (handicapType !== undefined) updates.handicap_type = handicapType;
    if (phone !== undefined) updates.phone = phone;

    const { data, error } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: updates,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      await sql`
        UPDATE users
        SET 
          first_name = ${updates.first_name !== undefined ? updates.first_name : sql`first_name`},
          last_name = ${updates.last_name !== undefined ? updates.last_name : sql`last_name`},
          handicap_type = ${updates.handicap_type !== undefined ? updates.handicap_type : sql`handicap_type`},
          phone = ${updates.phone !== undefined ? updates.phone : sql`phone`},
          updated_at = NOW()
        WHERE id = ${userId}
      `;
    } catch (dbError) {
      console.error("Erreur synchronisation DB:", dbError);
    }

    const dbUser = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    const user = {
      id: data.user.id,
      email: data.user.email,
      firstName: dbUser[0]?.first_name || data.user.user_metadata?.first_name || null,
      lastName: dbUser[0]?.last_name || data.user.user_metadata?.last_name || null,
      handicapType: dbUser[0]?.handicap_type || data.user.user_metadata?.handicap_type || null,
      createdAt: dbUser[0]?.created_at?.toISOString() || data.user.created_at,
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur lors de la mise à jour",
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token requis" });
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken,
      });

    if (authError || !authData.session) {
      return res
        .status(401)
        .json({ error: "Refresh token invalide ou expiré" });
    }

    const session = {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt:
        authData.session.expires_at || Math.floor(Date.now() / 1000) + 3600,
    };

    res.json(session);
  } catch (error) {
    res.status(500).json({
      error: "Erreur serveur lors du rafraîchissement",
    });
  }
});

export default router;
