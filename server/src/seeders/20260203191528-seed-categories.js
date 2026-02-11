'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing users
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" ORDER BY "createdAt" ASC LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length < 3) {
      throw new Error('Not enough users found. Please run user seeder first.');
    }

    const [john, jane, bob] = users;

    await queryInterface.bulkInsert('Categories', [
      // John's Expense Categories
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Groceries',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Transportation',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Entertainment',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // John's Income Categories
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Salary',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Freelance',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Bonus',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Interest',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Other',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Jane's Expense Categories
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Rent',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Utilities',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Healthcare',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Jane's Income Categories
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Salary',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Bonus',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Interest',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Other',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bob's Expense Categories
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Office Supplies',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Marketing',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Travel',
        type: 'expense',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bob's Income Categories
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Salary',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Business Revenue',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Investments',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Bonus',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Interest',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Other',
        type: 'income',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
