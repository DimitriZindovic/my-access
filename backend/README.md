# My Access Backend API

Backend Express.js API with TypeScript for the My Access application using Supabase for authentication and Prisma ORM for database operations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:

### Connexion à Supabase

Ce projet utilise Supabase de deux manières différentes :

#### A. Base de données PostgreSQL (via Prisma ORM)

**`DATABASE_URL`** : Connection string PostgreSQL vers votre base Supabase

Pour obtenir cette URL :
1. Allez dans votre projet Supabase Dashboard
2. Naviguez vers **Settings** > **Database**
3. Sous **Connection string**, vous avez deux options :

   **Option 1 : Connection Pooling (Recommandé pour production)**
   - Sélectionnez **Connection pooling** > **Session mode** ou **Transaction mode**
   - Port : `6543` (pgbouncer)
   - Format : `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - ✅ Recommandé pour les applications en production (meilleure gestion des connexions)

   **Option 2 : Connection Directe (Pour migrations Prisma)**
   - Sélectionnez **URI**
   - Port : `5432` (direct)
   - Format : `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - ⚠️ Utilisez cette option uniquement pour `prisma migrate` ou `prisma db push`

**Important** :
- Pour le développement et la production, utilisez **Connection pooling** (port 6543)
- Pour les migrations Prisma, utilisez la **Connection directe** (port 5432) car Prisma a besoin d'un accès direct pour créer/modifier les schémas
- Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données Supabase
- Prisma se connecte directement à PostgreSQL, pas via les API keys Supabase

#### B. Authentification (via Supabase Auth)

Ces variables sont utilisées uniquement pour l'authentification des utilisateurs :

- **`SUPABASE_URL`** : URL de votre projet Supabase (format: `https://xxxxx.supabase.co`)
- **`SUPABASE_ANON_KEY`** : Clé publique anonyme (trouvable dans **Settings** > **API** > **Project API keys**)
- **`SUPABASE_SERVICE_ROLE_KEY`** : Clé service role (trouvable dans **Settings** > **API** > **Project API keys** - ⚠️ gardez-la secrète)

#### C. Configuration serveur

- **`PORT`** : Port du serveur (default: 3001)
- **`FRONTEND_URL`** : URL du frontend pour CORS (ex: `http://localhost:3000`)

### Exemple de fichier `.env` :

```env
# Database (Connection pooling - recommandé pour production)
# Remplacez [YOUR-PASSWORD] par votre mot de passe Supabase
DATABASE_URL=postgresql://postgres.bvcnxnbfdztaqwtnpspp:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Pour les migrations Prisma, utilisez la connection directe (port 5432) :
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.bvcnxnbfdztaqwtnpspp.supabase.co:5432/postgres

# Supabase Auth (pour l'authentification uniquement)
SUPABASE_URL=https://bvcnxnbfdztaqwtnpspp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Note** : Pour exécuter les migrations Prisma (`prisma migrate` ou `prisma db push`), vous devrez temporairement utiliser la connection directe (port 5432) car Prisma nécessite un accès direct à la base de données pour modifier le schéma.

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:

**⚠️ Important** : Pour les migrations Prisma, vous devez utiliser la **connection directe** (port 5432) car Prisma nécessite un accès direct à la base de données.

**Option A : Migration avec prisma migrate (recommandé pour production)**
```bash
# Temporairement, changez DATABASE_URL dans .env pour utiliser le port 5432
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
npm run prisma:migrate
# Puis remettez la connection pooling (port 6543) pour l'application
```

**Option B : Push du schéma (pour développement)**
```bash
# Temporairement, changez DATABASE_URL dans .env pour utiliser le port 5432
npm run prisma:push
# Puis remettez la connection pooling (port 6543) pour l'application
```

**Astuce** : Vous pouvez créer deux fichiers `.env` :
- `.env` : Connection pooling (port 6543) pour l'application
- `.env.migrate` : Connection directe (port 5432) pour les migrations
  - Utilisez : `dotenv -e .env.migrate -- npm run prisma:migrate`

## Database Schema

The database schema is defined in `prisma/schema.prisma`. The schema includes:

- **users**: User profiles linked to Supabase Auth
- **centers**: Medical centers/healthcare facilities
- **accessibility_specs**: Accessibility specifications for centers
- **reviews**: User reviews of centers
- **bookings**: Appointment bookings

To view and edit data:
```bash
npm run prisma:studio
```

## Running the Server

Development (with hot reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
  - Body: `{ email, password, firstName?, lastName?, phone?, handicapType? }`
- `POST /api/auth/login` - Authenticate user
  - Body: `{ email, password }`
- `GET /api/auth/me` - Get current authenticated user (requires auth token)
- `POST /api/auth/logout` - Logout current user (requires auth token)
- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ refresh_token }`

### Health Check

- `GET /health` - Server health check

## Authentication

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <access_token>
```

The access token is returned in the `session` object after login/signup.

## Architecture

### Connexions Supabase

Ce projet utilise deux connexions distinctes à Supabase :

1. **Prisma ORM** → Connexion directe à PostgreSQL via `DATABASE_URL`
   - Gère toutes les opérations CRUD sur les tables
   - Pas besoin des API keys Supabase pour la base de données
   - Utilise la connection string PostgreSQL standard

2. **Supabase Auth Client** → Connexion via API keys pour l'authentification
   - Gère l'inscription, connexion, et gestion des sessions
   - Utilise `SUPABASE_URL`, `SUPABASE_ANON_KEY`, et `SUPABASE_SERVICE_ROLE_KEY`
   - Les utilisateurs sont créés dans Supabase Auth, puis synchronisés avec la table `users` via Prisma

### Pourquoi cette architecture ?

- **Prisma** offre une meilleure expérience développeur avec TypeScript et des migrations robustes
- **Supabase Auth** gère l'authentification, les tokens JWT, et la sécurité
- Les deux travaillent ensemble : Auth crée les utilisateurs, Prisma gère leurs profils dans la DB

## Tech Stack

- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Prisma**: Modern ORM for database operations (connexion directe PostgreSQL)
- **Supabase Auth**: Authentication service (via API keys)
- **PostgreSQL**: Database (hébergée sur Supabase)
- **express-validator**: Request validation
