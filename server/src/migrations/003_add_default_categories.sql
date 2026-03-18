BEGIN;

--------------------------------------------------
-- 1. INSERT ALL MISSING PARENT CATEGORIES
--------------------------------------------------

INSERT INTO "Categories" ("id","userId","name","type","parentId","createdAt","updatedAt")
SELECT 
    gen_random_uuid(),
    u.id,
    parent.name,
    parent.type::"enum_Categories_type",
    NULL,
    NOW(),
    NOW()
FROM "Users" u
CROSS JOIN (
  VALUES
  ('Salary','income'),
  ('Bonus','income'),
  ('Interest','income'),
  ('Freelance','income'),
  ('Investment','income'),
  ('Other Income','income'),

  ('Home','expense'),
  ('Transportation','expense'),
  ('Travel','expense'),
  ('Food','expense'),
  ('Entertainment','expense'),
  ('Education','expense'),
  ('Healthcare','expense'),
  ('Government Dues','expense'),
  ('Work Dues','expense'),
  ('Other Expense','expense')
) AS parent(name,type)
WHERE NOT EXISTS (
  SELECT 1
  FROM "Categories" c
  WHERE c."userId" = u.id
  AND c.name = parent.name
);

--------------------------------------------------
-- 2. INSERT ALL MISSING CHILD CATEGORIES
--------------------------------------------------
INSERT INTO "Categories" ("id","userId","name","type","parentId","createdAt","updatedAt")
SELECT
  gen_random_uuid(),
  parent."userId",
  child.name,
  'expense'::"enum_Categories_type",
  parent.id,
  NOW(),
  NOW()
FROM "Categories" parent
JOIN (
  VALUES
  ('Home','Mortgage'),
  ('Home','Rent'),
  ('Home','Utilities'),
  ('Home','Home Insurance'),
  ('Home','Property Tax'),

  ('Transportation','Public Transit'),
  ('Transportation','Car Maintenance'),
  ('Transportation','Car Loan'),
  ('Transportation','Car Insurance'),
  ('Transportation','Gas'),

  ('Travel','Vacation'),

  ('Food','Groceries'),
  ('Food','Dining Out'),

  ('Entertainment','Games'),
  ('Entertainment','Shows'),

  ('Healthcare','Medical'),
  ('Healthcare','Fitness'),

  ('Government Dues','Income Tax'),
  ('Government Dues','Employment Insurance'),
  ('Government Dues','Canadian Pension Plan'),

  ('Work Dues','Work Pension'),
  ('Work Dues','Benefit Dues')
) AS child(parent_name,name)
ON parent.name = child.parent_name
WHERE NOT EXISTS (
  SELECT 1
  FROM "Categories" c
  WHERE c."userId" = parent."userId"
  AND c.name = child.name
);