'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. INSERT ALL MISSING PARENT CATEGORIES
      await queryInterface.sequelize.query(
        `
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
        )
        `,
        { transaction }
      );

      // 2. INSERT ALL MISSING CHILD CATEGORIES
      await queryInterface.sequelize.query(
        `
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
        )
        `,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Reversing this might be destructive, but for a down migration we should at least try to remove the defaults added
    // However, usually we don't want to delete user data. 
    // For simplicity, we can delete the categories by name for all users, but that's risky if they created their own with same name.
    // Given the context, we'll just leave it empty or implement a simple delete.
  }
};
