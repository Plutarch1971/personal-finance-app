"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CATEGORIES = void 0;
exports.DEFAULT_CATEGORIES = [
    // Income categories
    { name: 'Salary', type: 'income', parent: null },
    { name: 'Bonus', type: 'income', parent: null },
    { name: 'Freelance', type: 'income', parent: null },
    { name: 'Government Benefits', type: 'income', parent: null },
    { name: 'Old Age Benefit', type: 'income', parent: 'Government Benefits' },
    { name: 'Canadian Pension Plan', type: 'income', parent: 'Government Benefits' },
    { name: 'Child Benefit', type: 'income', parent: 'Government Benefits' },
    { name: 'Employment Insurance', type: 'income', parent: 'Government Benefits' },
    { name: 'Other Income', type: 'income', parent: null },
    // Investment Income Categories
    { name: 'Investment Income', type: 'income', parent: null },
    { name: 'Dividends', type: 'income', parent: 'Investment Income' },
    { name: 'Interest', type: 'income', parent: 'Investment Income' },
    { name: 'TSFA', type: 'income', parent: 'Investment Income' },
    { name: 'GIC', type: 'income', parent: 'Investment Income' },
    { name: 'Bonds', type: 'income', parent: 'Investment Income' },
    { name: 'Stocks', type: 'income', parent: 'Investment Income' },
    { name: 'RRSP', type: 'income', parent: 'Investment Income' },
    { name: 'RESP', type: 'income', parent: 'Investment Income' },
    { name: 'Other Investment', type: 'income', parent: 'Investment Income' },
    // Expense categories with parent-child relationships
    // Home
    { name: 'Home', type: 'expense', parent: null },
    { name: 'Mortgage', type: 'expense', parent: 'Home' },
    { name: 'Rent', type: 'expense', parent: 'Home' },
    { name: 'Utilities', type: 'expense', parent: 'Home' },
    { name: 'Home Insurance', type: 'expense', parent: 'Home' },
    { name: 'Property Tax', type: 'expense', parent: 'Home' },
    // Transportation
    { name: 'Transportation', type: 'expense', parent: null },
    { name: 'Public Transit', type: 'expense', parent: 'Transportation' },
    { name: 'Car Maintenance', type: 'expense', parent: 'Transportation' },
    { name: 'Car Loan', type: 'expense', parent: 'Transportation' },
    { name: 'Car Insurance', type: 'expense', parent: 'Transportation' },
    { name: 'Gas', type: 'expense', parent: 'Transportation' },
    // Travel
    { name: 'Travel', type: 'expense', parent: null },
    { name: 'Vacation', type: 'expense', parent: 'Travel' },
    // Food
    { name: 'Food', type: 'expense', parent: null },
    { name: 'Groceries', type: 'expense', parent: 'Food' },
    { name: 'Dining Out', type: 'expense', parent: 'Food' },
    // Entertainment
    { name: 'Entertainment', type: 'expense', parent: null },
    { name: 'Games', type: 'expense', parent: 'Entertainment' },
    { name: 'Shows', type: 'expense', parent: 'Entertainment' },
    // Other
    { name: 'Education', type: 'expense', parent: null },
    { name: 'Healthcare', type: 'expense', parent: null },
    { name: 'Medical', type: 'expense', parent: 'Healthcare' },
    { name: 'Fitness', type: 'expense', parent: 'Healthcare' },
    //Dues
    { name: 'Government Dues', type: 'expense', parent: null },
    { name: 'Income Tax', type: 'expense', parent: 'Government Dues' },
    { name: 'Employment Insurance', type: 'expense', parent: 'Government Dues' },
    { name: 'Canadian Pension Plan', type: 'expense', parent: 'Government Dues' },
    { name: 'Work Dues', type: 'expense', parent: null },
    { name: 'Work Pension', type: 'expense', parent: 'Work Dues' },
    { name: 'Benefit Dues', type: 'expense', parent: 'Work Dues' },
    { name: 'Other Expense', type: 'expense', parent: null },
];
