'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      parentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });

    await queryInterface.addIndex('Categories', ['parentId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Categories', ['parentId']);
    await queryInterface.dropTable('Categories');
    

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_categories_type') THEN
          DROP TYPE enum_categories_type;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Categories_type') THEN
          DROP TYPE "enum_Categories_type";
        END IF;
      END$$;
    `);
  }
};
 