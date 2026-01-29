require("dotenv").config();

// Pour les migrations Prisma, utiliser DATABASE_DIRECT_URL si disponible
// Sinon utiliser DATABASE_URL (qui peut être avec pgbouncer pour le client)
let migrationUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "DATABASE_URL or DATABASE_DIRECT_URL must be defined in .env file"
  );
}

// Nettoyer l'URL en enlevant les guillemets et espaces
migrationUrl = migrationUrl.trim().replace(/^["']|["']$/g, "");

// Pour Supabase avec Session Pooler, s'assurer que pgbouncer=true est présent
// et utiliser le mode session pour les migrations
if (
  migrationUrl.includes("pooler.supabase.com") &&
  migrationUrl.includes("pgbouncer=true")
) {
  // Le Session Pooler fonctionne pour les migrations en mode session
  // Pas besoin de modification supplémentaire
}

module.exports = {
  datasource: {
    url: migrationUrl,
  },
};
