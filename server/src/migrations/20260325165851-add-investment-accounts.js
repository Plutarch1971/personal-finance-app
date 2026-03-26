'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "Accounts" 
        ("id", "userId", "name", "type", "currency", "initialBalance", "balance", "createdAt", "updatedAt")
        
        SELECT 
          gen_random_uuid(),
          u.id,
          acc.name,
          'investment',
          'CAD',
          0,
          0,
          NOW(),
          NOW()
        FROM "Users" u
        CROSS JOIN (
          VALUES
            ('TFSA'),
            ('RRSP'),
            ('RESP'),
            ('Bonds'),
            ('Stocks'),
            ('GIC')
        ) AS acc(name)
        
        WHERE NOT EXISTS (
          SELECT 1
          FROM "Accounts" a
          WHERE a."userId" = u.id
          AND a.name = acc.name
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
      await queryInterface.sequelize.query(
        `
        DELETE FROM "Accounts"
        WHERE name IN (
          'TFSA',
          'RRSP',
          'RESP',
          'Bonds',
          'Stocks',
          'GIC'
        )
        AND type = 'investment'
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