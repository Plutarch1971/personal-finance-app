'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Get all users
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM "Users"',
        { transaction }
      );

      const userIds = users[0].map((u) => u.id);

      // For each user, create the Government Benefits parent category
      for (const userId of userIds) {
        // Check if parent category already exists
        const existingParent = await queryInterface.sequelize.query(
          `SELECT "id" FROM "Categories" WHERE "userId" = :userId AND "name" = 'Government Benefits'`,
          { replacements: { userId }, transaction }
        );

        let parentId;
        if (existingParent[0].length > 0) {
          parentId = existingParent[0][0].id;
        } else {
          // Create parent category
          const govBenefitsResult = await queryInterface.sequelize.query(
            `INSERT INTO "Categories" ("id", "userId", "name", "type", "createdAt", "updatedAt") 
             VALUES (gen_random_uuid(), :userId, 'Government Benefits', 'income', NOW(), NOW())
             RETURNING "id"`,
            { replacements: { userId }, transaction }
          );
          parentId = govBenefitsResult[0][0].id;
        }

        // Create child categories
        const childCategories = [
          'Old Age Benefit',
          'Canadian Pension Plan',
          'Child Benefit',
          'Employment Insurance',
        ];

        for (const childName of childCategories) {
          // Check if child already exists
          const existingChild = await queryInterface.sequelize.query(
            `SELECT "id" FROM "Categories" WHERE "userId" = :userId AND "name" = :childName`,
            { replacements: { userId, childName }, transaction }
          );

          if (existingChild[0].length === 0) {
            await queryInterface.sequelize.query(
              `INSERT INTO "Categories" ("id", "userId", "name", "type", "parentId", "createdAt", "updatedAt") 
               VALUES (gen_random_uuid(), :userId, :childName, 'income', :parentId, NOW(), NOW())`,
              {
                replacements: { userId, childName, parentId },
                transaction,
              }
            );
          }
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete all Government Benefits categories (parent and children) for all users
      await queryInterface.sequelize.query(
        `DELETE FROM "Categories" 
         WHERE "name" IN ('Government Benefits', 'Old Age Benefit', 'Canadian Pension Plan', 'Child Benefit', 'Employment Insurance')
         AND "type" = 'income'`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
