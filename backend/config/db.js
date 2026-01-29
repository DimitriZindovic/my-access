import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Vérifier que la connection string contient un mot de passe
if (connectionString.includes("[YOUR-PASSWORD]")) {
  throw new Error(
    "DATABASE_URL contient [YOUR-PASSWORD] - remplacez-le par votre mot de passe réel"
  );
}

// Créer la connexion à la base de données Postgres
const sql = postgres(connectionString, {
  // Options de configuration pour Supabase
  ssl: "require",
  max: 10, // Nombre maximum de connexions dans le pool
  idle_timeout: 20, // Temps d'inactivité avant fermeture (secondes)
  connect_timeout: 10, // Timeout de connexion (secondes)
  onnotice: () => {}, // Désactiver les notices PostgreSQL
  transform: {
    // Transformer les résultats pour un meilleur formatage
    undefined: null,
  },
});

// Test de connexion au démarrage (optionnel, peut être désactivé)
if (process.env.NODE_ENV !== "production") {
  sql`SELECT 1`
    .then(() => {
      console.log("✅ Connexion à la base de données Supabase réussie");
    })
    .catch((error) => {
      console.error("❌ Erreur de connexion à la base de données:", error.message);
      console.error(
        "\n💡 Vérifiez que votre DATABASE_URL dans .env est correcte."
      );
      console.error(
        "   Format attendu: postgresql://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres"
      );
    });
}

export default sql;
