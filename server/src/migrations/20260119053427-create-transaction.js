'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
      },
      amount: {
        type: Sequelize.DECIMAL(14, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      transactionDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
    await queryInterface.addIndex('Transactions', ['transactionDate']);
    await queryInterface.addIndex('Transactions', ['accountId']);
    await queryInterface.addIndex('Transactions', ['categoryId']);
    await queryInterface.addIndex('Transactions', ['userId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Transactions', ['transactionDate']);
    await queryInterface.removeIndex('Transactions', ['accountId']);
    await queryInterface.removeIndex('Transactions', ['categoryId']);
    await queryInterface.removeIndex('Transactions', ['userId']);
    await queryInterface.dropTable('Transactions');
  }
};