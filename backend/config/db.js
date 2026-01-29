import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

if (connectionString.includes("[YOUR-PASSWORD]")) {
  throw new Error(
    "DATABASE_URL contient [YOUR-PASSWORD] - remplacez-le par votre mot de passe réel"
  );
}

const sql = postgres(connectionString, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {},
  transform: {
    undefined: null,
  },
});

export default sql;
