# 🩺 My Access - Application de localisation de centres de vaccination accessibles

## 📌 Description

Ce projet consiste en une application web accessible permettant aux personnes en situation de handicap d'identifier des **centres de vaccination adaptés à leurs besoins spécifiques**.  
L'application met l'accent sur l'accessibilité numérique, l'inclusion et la fiabilité des informations grâce à une approche participative.

## 🏗️ Architecture

![Architecture](./docs/architecture.png)

L'architecture repose sur une approche modulaire et découplée :

### Stack technique

#### Frontend

- **React / Next.js 14+** (App Router)
- Rendu côté serveur (SSR) et statique (SSG)
- TypeScript pour la sécurité des types
- Tailwind CSS pour le styling
- Gestion de l'accessibilité et de l'expérience utilisateur

#### Backend

- **Node.js / Express**
- API REST
- Authentification Supabase
- Connexion directe à PostgreSQL (Supabase)
- Logique métier et validation

#### Base de données

- **Supabase (PostgreSQL)**
- Gestion des utilisateurs via Supabase Auth
- Table `users` pour les données utilisateur
- Table `centers` pour les centres de vaccination
- Table `accessibility_specs` pour les spécifications d'accessibilité
- Table `reviews` pour les avis utilisateurs
- Table `bookings` pour les rendez-vous

#### Déploiement

- **Frontend :** Vercel
- **Backend :** Render
- **Base de données :** Supabase (cloud)

#### CI/CD

- **GitHub Actions**
- Déploiement automatique sur push
- Workflows pour preview et production

---

## 🎯 Objectifs

- Faciliter l'accès à l'information sur les centres de vaccination accessibles
- Améliorer l'inclusion des personnes en situation de handicap
- Proposer une expérience utilisateur accessible, simple et efficace
- Centraliser des données fiables et mises à jour par la communauté

---

## 🚀 Fonctionnalités principales

### 🗺️ Carte interactive

- Affichage des centres de vaccination sur une carte
- Informations détaillées par centre
- Visualisation claire et accessible
- Filtrage géographique

### 🎛️ Filtres par type de handicap

- Mobilité réduite
- Handicap visuel
- Handicap auditif
- Troubles cognitifs
- Handicap psychique

### ⭐ Signalement et notation participative

- Notes attribuées par les utilisateurs (1-5 étoiles)
- Commentaires et retours d'expérience
- Signalement de problèmes d'accessibilité
- Calcul automatique des scores d'accessibilité

### 🔍 Recherche avancée

- Recherche par nom, adresse, ville
- Filtrage par type de centre (vaccination, dépistage, les deux)
- Filtrage par niveau d'accessibilité vérifié
- Tri par score d'accessibilité

### 👤 Gestion de compte

- Inscription et authentification sécurisée
- Profil utilisateur avec type de handicap
- Historique des avis et rendez-vous

---

## ♿ Accessibilité

L'accessibilité est un pilier central du projet.  
Les bonnes pratiques du **RGAA** et des **WCAG** sont appliquées :

- Contrastes de couleurs renforcés
- Liens d'évitement
- Navigation clavier complète
- Gestion visible du focus
- Hiérarchie sémantique des titres
- Utilisation appropriée des boutons et liens
- Définition de la langue pour les lecteurs d'écran
- Attributs `alt` pour toutes les images
- Support des lecteurs d'écran

---

## 📁 Structure du projet

```
my-access/
├── frontend/              # Application Next.js
│   ├── src/
│   │   ├── app/          # Pages et routes
│   │   ├── components/   # Composants réutilisables
│   │   ├── contexts/     # Contextes React (Auth)
│   │   ├── lib/          # Utilitaires et API
│   │   └── types/        # Types TypeScript
│   └── public/           # Assets statiques
│
├── backend/              # API Express
│   ├── config/           # Configuration (DB, Supabase)
│   ├── middleware/       # Middlewares (auth)
│   ├── routes/           # Routes API
│   └── migrations/       # Scripts SQL
│
└── docs/                 # Documentation
    └── architecture.png  # Schéma d'architecture
```

---

## 🛠️ Installation et développement

### Prérequis

- Node.js 20+
- npm ou yarn
- Compte Supabase
- Compte Vercel (pour le frontend)
- Compte Render (pour le backend)

### Installation

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

#### Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
FRONTEND_URL=http://localhost:3000
PORT=3001
```

Puis démarrez le serveur :

```bash
npm run dev
```

Le backend sera accessible sur `http://localhost:3001`

### Configuration de la base de données

1. Exécutez les migrations SQL dans Supabase SQL Editor :

   - `backend/migrations/00_complete_schema.sql` (si base vide)
   - `backend/migrations/01_add_missing_columns.sql` (si tables existent)
   - `backend/migrations/02_seed_centers.sql` (données de test)
   - `backend/migrations/03_disable_rls.sql` (désactiver RLS pour développement)

2. Vérifiez la connexion :
   ```bash
   curl http://localhost:3001/api/test-db
   ```

---

## 🌐 Déploiement

### Frontend (Vercel)

1. Créez un projet Vercel
2. Connectez votre repository
3. Root Directory : `frontend`
4. Variable d'environnement :
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend.onrender.com
   ```

### Backend (Render)

1. Créez un Web Service sur Render
2. Connectez votre repository
3. Root Directory : `backend`
4. Build Command : `npm install`
5. Start Command : `npm start`
6. Variables d'environnement :
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=votre_anon_key
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   FRONTEND_URL=https://votre-frontend.vercel.app
   PORT=10000
   ```

Consultez `backend/migrations/README.md` pour plus de détails sur les migrations.

---

## 📚 Documentation

- [Guide de déploiement](./DEPLOYMENT.md)
- [Variables d'environnement](./VERCEL_ENV_VARS.md)
- [Migrations SQL](./backend/migrations/README.md)

---

## 👥 Contributeurs

- **Dimitri ZINDOVIC**
- **Mohsen HOSEN**
- **Kyllian MARIE-MAGDELAINE**
- **Brunic FEYOU**
- **Anthony STELLET**

---

## 📝 License

ISC

---

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Express](https://expressjs.com/)
- [RGAA - Référentiel Général d'Amélioration de l'Accessibilité](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [WCAG - Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
