-- Migration 03: Désactiver RLS sur la table users (développement)
-- Execute this in Supabase SQL Editor

-- Désactiver Row Level Security sur la table users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Note: En production, vous devriez activer RLS et créer des politiques appropriées
-- Exemple de politique pour la production :
-- CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
