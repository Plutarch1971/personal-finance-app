'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing users to assign accounts
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM "Users" ORDER BY "createdAt" ASC LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length < 3) {
      throw new Error('Not enough users found. Please run user seeder first.');
    }

    const [john, jane, bob] = users;

    await queryInterface.bulkInsert('Accounts', [
      // John's accounts
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Main Checking',
        type: 'checking',
        currency: 'USD',
        initialBalance: 5000.00,
        balance: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        name: 'Savings Account',
        type: 'savings',
        currency: 'USD',
        initialBalance: 10000.00,
        balance: 10000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Jane's accounts
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Personal Checking',
        type: 'checking',
        currency: 'CAD',
        initialBalance: 3000.00,
        balance: 3000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        name: 'Credit Card',
        type: 'credit',
        currency: 'CAD',
        initialBalance: 0.00,
        balance: 0.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bob's accounts
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Business Checking',
        type: 'checking',
        currency: 'USD',
        initialBalance: 15000.00,
        balance: 15000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        name: 'Investment Portfolio',
        type: 'investment',
        currency: 'USD',
        initialBalance: 50000.00,
        balance: 50000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
