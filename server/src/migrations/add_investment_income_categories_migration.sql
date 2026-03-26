-- Migration: Add missing Investment Income categories to all users
-- Run once safely (idempotent)

BEGIN;

-- 1. Ensure parent category exists for each user
INSERT INTO "Categories" (id, "userId", name, type, "parentId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), u.id, 'Investment Income', 'income', NULL, NOW(), NOW()
FROM "Users" u
WHERE NOT EXISTS (
  SELECT 1 FROM "Categories" c
  WHERE c."userId" = u.id
    AND c.name = 'Investment Income'
);

-- 2. Insert child categories
WITH parent AS (
  SELECT id, "userId"
  FROM "Categories"
  WHERE name = 'Investment Income'
)
INSERT INTO "Categories" (id, "userId", name, type, "parentId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), p."userId", child.name, 'income', p.id, NOW(), NOW()
FROM parent p
CROSS JOIN (
  VALUES
    ('Dividends'),
    ('Interest'),
    ('TFSA'),
    ('GIC'),
    ('Bonds'),
    ('Stocks'),
    ('RRSP'),
    ('RESP'),
    ('Other Investment')
) AS child(name)
WHERE NOT EXISTS (
  SELECT 1 FROM "Categories" c
  WHERE c."userId" = p."userId"
    AND c.name = child.name
);

COMMIT;
