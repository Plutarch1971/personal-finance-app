'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Budgets', { 
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
         allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      month: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updatedAt: {
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Prevent duplicate budgets per user/category/month
    await queryInterface.addConstraint('Budgets', {
      fields: ['userId', 'categoryId', 'month'],
      type: 'unique',
      name: 'unique_user_category_month_budget',
    });
    
    await queryInterface.addIndex('Budgets', ['userId', 'month']);

    await queryInterface.addIndex('Budgets', ['categoryId']);

    
  },
   
  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Budgets');
    
  },
};
