-- Create test user directly in PostgreSQL
-- Password: db123!@#DB (hashed with bcrypt)

-- First, create a company
INSERT INTO companies (id, name, industry, region, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Carbon Depict Test Company',
  'other',
  'uk',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Then create the user (you'll need to copy the company ID from above)
-- The password hash for "db123!@#DB" is generated below
-- We'll use a placeholder - you should run the Node.js script to hash it properly

SELECT 'Run this after getting company ID:' AS note;
SELECT id FROM companies WHERE name = 'Carbon Depict Test Company';
