import { supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware pour vérifier l'authentification via le token Supabase
 */
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Erreur authentification:', error);
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
}
