-- Migration 02: Seed centers with test data
-- Execute this in Supabase SQL Editor after migration 01

-- Insert centers
INSERT INTO "centers" (
  "name", 
  "address", 
  "latitude", 
  "longitude", 
  "phone", 
  "email", 
  "website", 
  "hours", 
  "type", 
  "verified_access",
  "avg_rating",
  "created_at", 
  "updated_at"
) VALUES
-- Centre 1: Centre Médical Accessibilité Plus Paris 15
(
  'Centre Médical Accessibilité Plus Paris 15',
  '12 Rue de Vaugirard, 75015 Paris',
  48.8426,
  2.3159,
  '01 45 67 89 01',
  'contact@accessibilite-plus.fr',
  'https://accessibilite-plus.fr',
  'Lun-Ven: 8h-19h, Sam: 9h-17h',
  'both',
  true,
  4.7,
  NOW(),
  NOW()
),
-- Centre 2: Centre de Dépistage République
(
  'Centre de Dépistage République',
  '45 Boulevard Voltaire, 75011 Paris',
  48.8634,
  2.3774,
  '01 43 55 67 89',
  'info@depistage-republique.fr',
  NULL,
  'Lun-Sam: 9h-18h',
  'depistage',
  true,
  4.3,
  NOW(),
  NOW()
),
-- Centre 3: Centre de Vaccination Bastille
(
  'Centre de Vaccination Bastille',
  '78 Rue du Faubourg Saint-Antoine, 75012 Paris',
  48.8531,
  2.3741,
  '01 44 73 22 11',
  'vaccination@bastille-sante.fr',
  NULL,
  'Lun-Dim: 8h-20h',
  'vaccination',
  false,
  3.3,
  NOW(),
  NOW()
),
-- Centre 4: Hôpital Saint-Louis - Centre COVID
(
  'Hôpital Saint-Louis - Centre COVID',
  '1 Avenue Claude Vellefaux, 75010 Paris',
  48.8720,
  2.3698,
  '01 42 49 49 49',
  'covid@hopital-stlouis.fr',
  'https://hopital-stlouis.fr',
  '24h/24, 7j/7',
  'both',
  true,
  4.7,
  NOW(),
  NOW()
),
-- Centre 5: Centre Médical Nation
(
  'Centre Médical Nation',
  '234 Rue de Charenton, 75012 Paris',
  48.8443,
  2.3964,
  '01 43 07 15 20',
  'contact@centre-nation.fr',
  NULL,
  'Lun-Ven: 8h30-18h30',
  'vaccination',
  false,
  3.8,
  NOW(),
  NOW()
),
-- Centre 6: Centre de Santé Montmartre
(
  'Centre de Santé Montmartre',
  '15 Rue Lepic, 75018 Paris',
  48.8842,
  2.3387,
  '01 42 64 33 22',
  'contact@montmartre-sante.fr',
  'https://montmartre-sante.fr',
  'Lun-Ven: 9h-19h, Sam: 10h-16h',
  'both',
  true,
  4.5,
  NOW(),
  NOW()
),
-- Centre 7: Centre de Dépistage Châtelet
(
  'Centre de Dépistage Châtelet',
  '8 Rue de Rivoli, 75001 Paris',
  48.8584,
  2.3470,
  '01 40 26 20 20',
  'depistage@chatelet.fr',
  NULL,
  'Lun-Sam: 8h-20h',
  'depistage',
  true,
  4.2,
  NOW(),
  NOW()
),
-- Centre 8: Centre de Vaccination La Défense
(
  'Centre de Vaccination La Défense',
  '15 Place de la Défense, 92000 Puteaux',
  48.8900,
  2.2386,
  '01 47 76 40 00',
  'vaccination@defense.fr',
  NULL,
  'Lun-Ven: 9h-18h',
  'vaccination',
  false,
  3.5,
  NOW(),
  NOW()
),
-- Centre 9: Centre Médical Belleville
(
  'Centre Médical Belleville',
  '72 Boulevard de Belleville, 75020 Paris',
  48.8706,
  2.3833,
  '01 46 36 70 00',
  'contact@belleville-medical.fr',
  'https://belleville-medical.fr',
  'Lun-Ven: 8h-19h',
  'both',
  true,
  4.6,
  NOW(),
  NOW()
),
-- Centre 10: Centre de Santé République
(
  'Centre de Santé République',
  '12 Boulevard de Magenta, 75010 Paris',
  48.8698,
  2.3631,
  '01 42 08 50 00',
  'contact@republique-sante.fr',
  NULL,
  'Lun-Ven: 9h-18h, Sam: 9h-13h',
  'both',
  true,
  4.4,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Insert accessibility specs for centers
-- Note: Replace the center IDs with actual IDs from your database
-- You can get them with: SELECT id FROM centers ORDER BY created_at;

-- Get center IDs (this will be done dynamically, but here's the structure)
DO $$
DECLARE
  center1_id BIGINT;
  center2_id BIGINT;
  center3_id BIGINT;
  center4_id BIGINT;
  center5_id BIGINT;
  center6_id BIGINT;
  center7_id BIGINT;
  center8_id BIGINT;
  center9_id BIGINT;
  center10_id BIGINT;
BEGIN
  -- Get center IDs
  SELECT id INTO center1_id FROM centers WHERE name = 'Centre Médical Accessibilité Plus Paris 15' LIMIT 1;
  SELECT id INTO center2_id FROM centers WHERE name = 'Centre de Dépistage République' LIMIT 1;
  SELECT id INTO center3_id FROM centers WHERE name = 'Centre de Vaccination Bastille' LIMIT 1;
  SELECT id INTO center4_id FROM centers WHERE name = 'Hôpital Saint-Louis - Centre COVID' LIMIT 1;
  SELECT id INTO center5_id FROM centers WHERE name = 'Centre Médical Nation' LIMIT 1;
  SELECT id INTO center6_id FROM centers WHERE name = 'Centre de Santé Montmartre' LIMIT 1;
  SELECT id INTO center7_id FROM centers WHERE name = 'Centre de Dépistage Châtelet' LIMIT 1;
  SELECT id INTO center8_id FROM centers WHERE name = 'Centre de Vaccination La Défense' LIMIT 1;
  SELECT id INTO center9_id FROM centers WHERE name = 'Centre Médical Belleville' LIMIT 1;
  SELECT id INTO center10_id FROM centers WHERE name = 'Centre de Santé République' LIMIT 1;

  -- Insert accessibility specs
  INSERT INTO "accessibility_specs" (
    "center_id",
    "has_ramp",
    "has_elevator",
    "door_width_cm",
    "has_braille_signage",
    "has_audio_guidance",
    "has_quiet_zone",
    "staff_trained",
    "website_accessible",
    "created_at",
    "updated_at"
  ) VALUES
  -- Centre 1: Excellent accessibilité
  (
    center1_id,
    true,
    true,
    90,
    true,
    true,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 2: Bonne accessibilité
  (
    center2_id,
    true,
    false,
    85,
    true,
    false,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 3: Accessibilité moyenne
  (
    center3_id,
    false,
    false,
    75,
    false,
    false,
    false,
    true,
    false,
    NOW(),
    NOW()
  ),
  -- Centre 4: Excellent accessibilité (hôpital)
  (
    center4_id,
    true,
    true,
    95,
    true,
    true,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 5: Accessibilité correcte
  (
    center5_id,
    true,
    false,
    80,
    false,
    false,
    false,
    true,
    false,
    NOW(),
    NOW()
  ),
  -- Centre 6: Très bonne accessibilité
  (
    center6_id,
    true,
    true,
    88,
    true,
    false,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 7: Bonne accessibilité
  (
    center7_id,
    true,
    true,
    82,
    true,
    false,
    false,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 8: Accessibilité basique
  (
    center8_id,
    false,
    true,
    78,
    false,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  -- Centre 9: Très bonne accessibilité
  (
    center9_id,
    true,
    true,
    87,
    true,
    true,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Centre 10: Bonne accessibilité
  (
    center10_id,
    true,
    true,
    83,
    true,
    false,
    true,
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (center_id) DO UPDATE SET
    "has_ramp" = EXCLUDED."has_ramp",
    "has_elevator" = EXCLUDED."has_elevator",
    "door_width_cm" = EXCLUDED."door_width_cm",
    "has_braille_signage" = EXCLUDED."has_braille_signage",
    "has_audio_guidance" = EXCLUDED."has_audio_guidance",
    "has_quiet_zone" = EXCLUDED."has_quiet_zone",
    "staff_trained" = EXCLUDED."staff_trained",
    "website_accessible" = EXCLUDED."website_accessible",
    "updated_at" = NOW();
END $$;
