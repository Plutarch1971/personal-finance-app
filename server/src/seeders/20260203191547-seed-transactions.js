'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing users
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM "Users" ORDER BY "createdAt" ASC LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length < 3) {
      throw new Error('Not enough users found. Please run user seeder first.');
    }

    const [john, jane, bob] = users;

    // Get accounts for each user
    const johnAccounts = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Accounts" WHERE "userId" = '${john.id}' ORDER BY "createdAt" ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const janeAccounts = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Accounts" WHERE "userId" = '${jane.id}' ORDER BY "createdAt" ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const bobAccounts = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Accounts" WHERE "userId" = '${bob.id}' ORDER BY "createdAt" ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get categories for each user
    const johnCategories = await queryInterface.sequelize.query(
      `SELECT id, name, type FROM "Categories" WHERE "userId" = '${john.id}'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const janeCategories = await queryInterface.sequelize.query(
      `SELECT id, name, type FROM "Categories" WHERE "userId" = '${jane.id}'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const bobCategories = await queryInterface.sequelize.query(
      `SELECT id, name, type FROM "Categories" WHERE "userId" = '${bob.id}'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Helper to find category by name
    const findCategory = (categories, name) => categories.find(c => c.name === name);

    await queryInterface.bulkInsert('Transactions', [
      // John's transactions (Main Checking)
      {
        id: uuidv4(),
        userId: john.id,
        accountId: johnAccounts[0].id, // Main Checking
        categoryId: findCategory(johnCategories, 'Salary')?.id,
        amount: 5000.00,
        description: 'Monthly Salary',
        transactionDate: new Date('2026-02-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        accountId: johnAccounts[0].id,
        categoryId: findCategory(johnCategories, 'Groceries')?.id,
        amount: -150.50,
        description: 'Whole Foods grocery shopping',
        transactionDate: new Date('2026-02-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        accountId: johnAccounts[0].id,
        categoryId: findCategory(johnCategories, 'Transportation')?.id,
        amount: -45.00,
        description: 'Gas station fill-up',
        transactionDate: new Date('2026-02-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: john.id,
        accountId: johnAccounts[0].id,
        categoryId: findCategory(johnCategories, 'Entertainment')?.id,
        amount: -75.00,
        description: 'Netflix and Spotify subscriptions',
        transactionDate: new Date('2026-02-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // John's savings transactions
      {
        id: uuidv4(),
        userId: john.id,
        accountId: johnAccounts[1].id, // Savings
        categoryId: findCategory(johnCategories, 'Freelance')?.id,
        amount: 1500.00,
        description: 'Freelance project payment',
        transactionDate: new Date('2026-01-28'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Jane's transactions (Personal Checking)
      {
        id: uuidv4(),
        userId: jane.id,
        accountId: janeAccounts[0].id, // Personal Checking
        categoryId: findCategory(janeCategories, 'Salary')?.id,
        amount: 4200.00,
        description: 'Bi-weekly salary',
        transactionDate: new Date('2026-01-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        accountId: janeAccounts[0].id,
        categoryId: findCategory(janeCategories, 'Rent')?.id,
        amount: -1500.00,
        description: 'Monthly rent payment',
        transactionDate: new Date('2026-02-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        accountId: janeAccounts[0].id,
        categoryId: findCategory(janeCategories, 'Utilities')?.id,
        amount: -120.00,
        description: 'Electricity and water bill',
        transactionDate: new Date('2026-02-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: jane.id,
        accountId: janeAccounts[0].id,
        categoryId: findCategory(janeCategories, 'Healthcare')?.id,
        amount: -85.00,
        description: 'Doctor visit copay',
        transactionDate: new Date('2026-02-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bob's transactions (Business Checking)
      {
        id: uuidv4(),
        userId: bob.id,
        accountId: bobAccounts[0].id, // Business Checking
        categoryId: findCategory(bobCategories, 'Business Revenue')?.id,
        amount: 8500.00,
        description: 'Client payment - Project Alpha',
        transactionDate: new Date('2026-01-30'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        accountId: bobAccounts[0].id,
        categoryId: findCategory(bobCategories, 'Office Supplies')?.id,
        amount: -250.00,
        description: 'Office furniture and supplies',
        transactionDate: new Date('2026-02-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        accountId: bobAccounts[0].id,
        categoryId: findCategory(bobCategories, 'Marketing')?.id,
        amount: -500.00,
        description: 'Facebook Ads campaign',
        transactionDate: new Date('2026-02-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: bob.id,
        accountId: bobAccounts[0].id,
        categoryId: findCategory(bobCategories, 'Travel')?.id,
        amount: -1200.00,
        description: 'Business trip to NYC',
        transactionDate: new Date('2026-02-03'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bob's investment transactions
      {
        id: uuidv4(),
        userId: bob.id,
        accountId: bobAccounts[1].id, // Investment Portfolio
        categoryId: findCategory(bobCategories, 'Investments')?.id,
        amount: 2500.00,
        description: 'Stock dividend payment',
        transactionDate: new Date('2026-01-29'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Note: Account balances are NOT updated here because the transaction service
    // handles balance updates automatically when transactions are created via API.
    // If you want to manually sync balances after seeding, you would need to:
    // 1. Calculate total transactions per account
    // 2. Update account balances accordingly
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
