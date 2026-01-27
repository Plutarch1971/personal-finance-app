'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Convert `type` to ENUM
    await queryInterface.changeColumn('Accounts', 'type', {
      type: Sequelize.ENUM(
        'checking',
        'savings',
        'credit',
        'cash',
        'investment',
        'wallet'
      ),
      allowNull: false,
    });

    // 2. Ensure currency is 3 letters
    await queryInterface.changeColumn('Accounts', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'CAD',
    });

    // 3. Add new columns
    await queryInterface.addColumn('Accounts', 'initialBalance', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    });

    await queryInterface.addColumn('Accounts', 'balance', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    });

    await queryInterface.addColumn('Accounts', 'archived', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // rollback changes
    await queryInterface.removeColumn('Accounts', 'initialBalance');
    await queryInterface.removeColumn('Accounts', 'balance');
    await queryInterface.removeColumn('Accounts', 'archived');

    await queryInterface.changeColumn('Accounts', 'type', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn('Accounts', 'currency', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'CAD',
    });
  },
};
