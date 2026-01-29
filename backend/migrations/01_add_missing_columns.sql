-- Migration 01: Add missing columns to centers table
-- Execute this in Supabase SQL Editor

-- Add missing columns to centers table
ALTER TABLE "centers" 
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "website" TEXT,
ADD COLUMN IF NOT EXISTS "hours" TEXT DEFAULT 'Lun-Ven: 9h-18h',
ADD COLUMN IF NOT EXISTS "type" TEXT DEFAULT 'both' CHECK (type IN ('vaccination', 'depistage', 'both'));

-- Update existing centers with default values if needed
UPDATE "centers" 
SET 
  "hours" = COALESCE("hours", 'Lun-Ven: 9h-18h'),
  "type" = COALESCE("type", 'both')
WHERE "hours" IS NULL OR "type" IS NULL;
