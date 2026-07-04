'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1) Ensure parent category exists for each user
      await queryInterface.sequelize.query(
        `
        INSERT INTO "Categories" ("id", "userId", "name", "type", "parentId", "createdAt", "updatedAt")
        SELECT gen_random_uuid(), u.id, 'Investment Income', 'income', NULL, NOW(), NOW()
        FROM "Users" u
        WHERE NOT EXISTS (
          SELECT 1
          FROM "Categories" c
          WHERE c."userId" = u.id
            AND c."name" = 'Investment Income'
        )
        `,
        { transaction }
      );

      // 2) Insert child categories under each user's Investment Income parent
      await queryInterface.sequelize.query(
        `
        WITH parent AS (
          SELECT id, "userId"
          FROM "Categories"
          WHERE "name" = 'Investment Income'
            AND "type" = 'income'
        )
        INSERT INTO "Categories" ("id", "userId", "name", "type", "parentId", "createdAt", "updatedAt")
        SELECT gen_random_uuid(), p."userId", child."name", 'income', p.id, NOW(), NOW()
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
        ) AS child("name")
        WHERE NOT EXISTS (
          SELECT 1
          FROM "Categories" c
          WHERE c."userId" = p."userId"
            AND c."name" = child."name"
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
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete child categories first, then parent category
      await queryInterface.sequelize.query(
        `
        DELETE FROM "Categories"
        WHERE "type" = 'income'
          AND "name" IN (
            'Dividends',
            'Interest',
            'TFSA',
            'GIC',
            'Bonds',
            'Stocks',
            'RRSP',
            'RESP',
            'Other Investment'
          )
        `,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `
        DELETE FROM "Categories"
        WHERE "type" = 'income'
          AND "name" = 'Investment Income'
        `,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
