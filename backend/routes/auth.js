import express from 'express';
import { supabaseAdmin, supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Créer un nouveau compte utilisateur
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, handicapType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
          handicap_type: handicapType || null,
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Erreur lors de la création du compte' });
    }

    // Récupérer la session si disponible
    let session = null;
    if (authData.session) {
      session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at || Math.floor(Date.now() / 1000) + 3600,
      };
    }

    // Retourner les données utilisateur
    const user = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: authData.user.user_metadata?.first_name || null,
      lastName: authData.user.user_metadata?.last_name || null,
      handicapType: authData.user.user_metadata?.handicap_type || null,
    };

    res.status(201).json({
      message: 'Compte créé avec succès',
      user,
      session,
    });
  } catch (error) {
    console.error('Erreur signup:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

/**
 * POST /api/auth/login
 * Connecter un utilisateur
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Authentifier l'utilisateur avec Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (!authData.user || !authData.session) {
      return res.status(401).json({ error: 'Erreur lors de la connexion' });
    }

    // Créer la session
    const session = {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: authData.session.expires_at || Math.floor(Date.now() / 1000) + 3600,
    };

    // Retourner les données utilisateur
    const user = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: authData.user.user_metadata?.first_name || null,
      lastName: authData.user.user_metadata?.last_name || null,
      handicapType: authData.user.user_metadata?.handicap_type || null,
    };

    res.json({
      user,
      session,
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

/**
 * POST /api/auth/logout
 * Déconnecter un utilisateur
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Récupérer le refresh token depuis le body si disponible
    const { refreshToken } = req.body;

    // Déconnecter l'utilisateur dans Supabase
    if (refreshToken) {
      await supabaseAdmin.auth.signOut({ refreshToken });
    } else {
      // Si pas de refresh token, on déconnecte juste côté serveur
      // Le client devra supprimer le token localement
    }

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur logout:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

/**
 * GET /api/auth/me
 * Récupérer les informations de l'utilisateur connecté
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer les données utilisateur depuis Supabase
    const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !userData.user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
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
    console.error('Erreur me:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/auth/me
 * Mettre à jour le profil utilisateur
 */
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, handicapType, phone } = req.body;

    // Préparer les métadonnées à mettre à jour
    const updates = {};
    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (handicapType !== undefined) updates.handicap_type = handicapType;
    if (phone !== undefined) updates.phone = phone;

    // Mettre à jour les métadonnées utilisateur
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: updates,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Retourner les données mises à jour
    const user = {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata?.first_name || null,
      lastName: data.user.user_metadata?.last_name || null,
      handicapType: data.user.user_metadata?.handicap_type || null,
      createdAt: data.user.created_at,
    };

    res.json(user);
  } catch (error) {
    console.error('Erreur update profile:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
});

/**
 * POST /api/auth/refresh
 * Rafraîchir le token d'accès
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requis' });
    }

    // Rafraîchir la session avec Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (authError || !authData.session) {
      return res.status(401).json({ error: 'Refresh token invalide ou expiré' });
    }

    const session = {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: authData.session.expires_at || Math.floor(Date.now() / 1000) + 3600,
    };

    res.json(session);
  } catch (error) {
    console.error('Erreur refresh:', error);
    res.status(500).json({ error: 'Erreur serveur lors du rafraîchissement' });
  }
});

export default router;
