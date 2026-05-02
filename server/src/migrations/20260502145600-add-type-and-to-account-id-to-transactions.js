'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('Transactions');

    // 1. Add or Update `type` column
    if (!tableDefinition.type) {
      await queryInterface.addColumn('Transactions', 'type', {
        type: Sequelize.ENUM('income', 'expense', 'transfer'),
        allowNull: false,
        defaultValue: 'expense',
      });
    } else if (tableDefinition.type.type.includes('CHARACTER VARYING')) {
      // Convert VARCHAR to ENUM
      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Transactions_type') THEN
            CREATE TYPE "enum_Transactions_type" AS ENUM('income', 'expense', 'transfer');
          END IF;
        END$$;
      `);
      
      await queryInterface.sequelize.query(`
        ALTER TABLE "Transactions" ALTER COLUMN "type" DROP DEFAULT;
      `);
      
      await queryInterface.sequelize.query(`
        ALTER TABLE "Transactions" 
        ALTER COLUMN "type" TYPE "enum_Transactions_type" 
        USING "type"::"enum_Transactions_type";
      `);
      
      await queryInterface.sequelize.query(`
        ALTER TABLE "Transactions" 
        ALTER COLUMN "type" SET DEFAULT 'expense';
      `);
    }

    // 2. Add or Update `toAccountId` column
    if (!tableDefinition.toAccountId) {
      await queryInterface.addColumn('Transactions', 'toAccountId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    } else {
      // Check if FK already exists
      const [results] = await queryInterface.sequelize.query(`
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'Transactions' AND column_name = 'toAccountId' 
        AND constraint_name = 'Transactions_toAccountId_fkey'
      `);

      if (results.length === 0) {
        // Clean up invalid toAccountId references
        await queryInterface.sequelize.query(`
          UPDATE "Transactions" 
          SET "toAccountId" = NULL 
          WHERE "toAccountId" IS NOT NULL 
          AND "toAccountId" NOT IN (SELECT id FROM "Accounts");
        `);

        await queryInterface.addConstraint('Transactions', {
          fields: ['toAccountId'],
          type: 'foreign key',
          name: 'Transactions_toAccountId_fkey',
          references: {
            table: 'Accounts',
            field: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        });
      }
    }

    // 3. Add index for `toAccountId` if missing
    const indexes = await queryInterface.showIndex('Transactions');
    const hasToAccountIndex = indexes.some(idx => 
      idx.name === 'transactions_to_account_id' || 
      (idx.fields && idx.fields.some(f => f.attribute === 'toAccountId'))
    );
    
    if (!hasToAccountIndex) {
      await queryInterface.addIndex('Transactions', ['toAccountId'], {
        name: 'transactions_to_account_id'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // 1. Remove index
    const indexes = await queryInterface.showIndex('Transactions');
    const hasToAccountIndex = indexes.some(idx => idx.name === 'transactions_to_account_id');
    if (hasToAccountIndex) {
      await queryInterface.removeIndex('Transactions', 'transactions_to_account_id');
    }

    // 2. Remove columns/FK
    const tableDefinition = await queryInterface.describeTable('Transactions');
    
    if (tableDefinition.toAccountId) {
      await queryInterface.removeColumn('Transactions', 'toAccountId');
    }
    
    if (tableDefinition.type) {
      await queryInterface.removeColumn('Transactions', 'type');
    }

    // 3. Drop the ENUM type (Postgres specific)
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Transactions_type') THEN
          DROP TYPE "enum_Transactions_type";
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_transactions_type') THEN
          DROP TYPE enum_transactions_type;
        END IF;
      END$$;
    `);
  },
};
