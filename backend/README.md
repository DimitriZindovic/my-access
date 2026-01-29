# Backend - My Access

Backend Express.js avec authentification Supabase.

## Installation

```bash
npm install
```

## Configuration

1. Créer un fichier `.env` à la racine du dossier `backend` :

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Connection String (Postgres direct connection)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (optionnel)
FRONTEND_URL=http://localhost:3000
```

2. Obtenir les clés Supabase :
   - Allez sur https://supabase.com
   - Créez un nouveau projet ou utilisez un projet existant
   - Dans les paramètres du projet → API, vous trouverez :
     - `SUPABASE_URL` : L'URL de votre projet
     - `SUPABASE_ANON_KEY` : La clé anonyme (publique)
     - `SUPABASE_SERVICE_ROLE_KEY` : La clé de service (secrète, à garder privée)
   
3. Obtenir la connection string de la base de données :
   - Dans votre projet Supabase, allez dans **Settings** → **Database**
   - Sous **Connection string**, sélectionnez :
     - **Type** : Node.js
     - **Source** : Primary Database
     - **Method** : Direct connection (ou Session Pooler pour IPv4)
   - Copiez la connection string et **remplacez `[YOUR-PASSWORD]` par votre mot de passe réel**
   - Pour trouver/réinitialiser votre mot de passe : **Settings** → **Database** → **Database password**
   
   ⚠️ **Si vous avez une erreur "password authentication failed"**, consultez le fichier `SETUP_DB.md` pour un guide détaillé.

## Démarrage

```bash
# Mode développement (avec watch)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3001` par défaut.

## Routes API

### Authentification

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Récupérer les infos utilisateur (requiert authentification)
- `PUT /api/auth/me` - Mettre à jour le profil (requiert authentification)
- `POST /api/auth/refresh` - Rafraîchir le token

### Santé

- `GET /health` - Vérifier l'état du serveur

## Structure

```
backend/
├── config/
│   ├── supabase.js      # Configuration Supabase (Auth)
│   └── db.js            # Connexion directe à Postgres
├── middleware/
│   └── auth.js          # Middleware d'authentification
├── routes/
│   └── auth.js          # Routes d'authentification
├── index.js             # Point d'entrée du serveur
├── package.json
└── .env                 # Variables d'environnement (à créer)
```

## Base de données Supabase

Le backend utilise deux méthodes de connexion à Supabase :

1. **Supabase Auth** (`@supabase/supabase-js`) :
   - Gère l'authentification des utilisateurs
   - Stockage des sessions
   - Tokens JWT
   - Les métadonnées utilisateur (firstName, lastName, handicapType) sont stockées dans `user_metadata` de Supabase Auth

2. **Connexion directe Postgres** (`postgres`) :
   - Connexion directe à la base de données Postgres
   - Permet d'exécuter des requêtes SQL directement
   - Utile pour des opérations complexes ou des migrations
   - Importez avec : `import sql from './config/db.js'`

### Exemple d'utilisation de la DB

```javascript
import sql from './config/db.js';

// Exécuter une requête
const users = await sql`SELECT * FROM users WHERE id = ${userId}`;

// Insérer des données
await sql`INSERT INTO centers (name, address) VALUES (${name}, ${address})`;
```
