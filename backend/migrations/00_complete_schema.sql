-- Migration 00: Complete database schema
-- Execute this FIRST in Supabase SQL Editor if starting from scratch
-- This includes all tables and the missing columns

-- CreateTable: users (if not exists)
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "handicap_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: centers (if not exists)
CREATE TABLE IF NOT EXISTS "centers" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "doctolib_ref_id" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "hours" TEXT DEFAULT 'Lun-Ven: 9h-18h',
    "type" TEXT DEFAULT 'both' CHECK (type IN ('vaccination', 'depistage', 'both')),
    "avg_rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "verified_access" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: accessibility_specs (if not exists)
CREATE TABLE IF NOT EXISTS "accessibility_specs" (
    "center_id" BIGINT NOT NULL,
    "has_ramp" BOOLEAN NOT NULL DEFAULT false,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "door_width_cm" INTEGER,
    "has_braille_signage" BOOLEAN NOT NULL DEFAULT false,
    "has_audio_guidance" BOOLEAN NOT NULL DEFAULT false,
    "has_quiet_zone" BOOLEAN NOT NULL DEFAULT false,
    "staff_trained" BOOLEAN NOT NULL DEFAULT false,
    "website_accessible" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accessibility_specs_pkey" PRIMARY KEY ("center_id")
);

-- CreateTable: reviews (if not exists)
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" BIGSERIAL NOT NULL,
    "center_id" BIGINT NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable: bookings (if not exists)
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "center_id" BIGINT NOT NULL,
    "external_booking_id" TEXT,
    "appointment_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: users email unique
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- CreateIndex: centers doctolib_ref_id unique
CREATE UNIQUE INDEX IF NOT EXISTS "centers_doctolib_ref_id_key" ON "centers"("doctolib_ref_id");

-- AddForeignKey: accessibility_specs -> centers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'accessibility_specs_center_id_fkey'
    ) THEN
        ALTER TABLE "accessibility_specs" 
        ADD CONSTRAINT "accessibility_specs_center_id_fkey" 
        FOREIGN KEY ("center_id") REFERENCES "centers"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: reviews -> centers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'reviews_center_id_fkey'
    ) THEN
        ALTER TABLE "reviews" 
        ADD CONSTRAINT "reviews_center_id_fkey" 
        FOREIGN KEY ("center_id") REFERENCES "centers"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: reviews -> users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'reviews_user_id_fkey'
    ) THEN
        ALTER TABLE "reviews" 
        ADD CONSTRAINT "reviews_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: bookings -> centers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookings_center_id_fkey'
    ) THEN
        ALTER TABLE "bookings" 
        ADD CONSTRAINT "bookings_center_id_fkey" 
        FOREIGN KEY ("center_id") REFERENCES "centers"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: bookings -> users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookings_user_id_fkey'
    ) THEN
        ALTER TABLE "bookings" 
        ADD CONSTRAINT "bookings_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Add missing columns to centers if they don't exist
ALTER TABLE "centers" 
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "website" TEXT,
ADD COLUMN IF NOT EXISTS "hours" TEXT DEFAULT 'Lun-Ven: 9h-18h',
ADD COLUMN IF NOT EXISTS "type" TEXT DEFAULT 'both';

-- Add constraint for type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'centers_type_check'
    ) THEN
        ALTER TABLE "centers" 
        ADD CONSTRAINT "centers_type_check" 
        CHECK (type IN ('vaccination', 'depistage', 'both'));
    END IF;
END $$;
