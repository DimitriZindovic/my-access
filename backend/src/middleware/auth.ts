import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    req.user = {
      id: user.id,
      email: user.email!,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(500).json({ error: "Erreur d'authentification" });
  }
}

// Middleware optionnel - n'échoue pas si pas de token
export async function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email!,
      };
    }
  } catch (error) {
    // Ignorer les erreurs, continuer sans utilisateur
  }

  next();
}
