import { supabaseAdmin } from "../config/supabase.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Token d'authentification manquant" });
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Erreur d'authentification" });
  }
}
