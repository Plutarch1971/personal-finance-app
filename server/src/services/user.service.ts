//user.service.ts
import { User, Category, Account } from '../models';
import { AccountType } from '../models/accounts';
import sequelize from '../config/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Default accounts for new users
const DEFAULT_ACCOUNTS: {
    name: string;
    type: AccountType;
    currency: 'CAD';
    balance: number
  }[] = [
    { name: 'Checking Account', type: 'checking', currency: 'CAD', balance: 0 },
    { name: 'Savings Account', type: 'savings', currency: 'CAD', balance: 0 },
    { name: 'Credit Card', type: 'credit', currency: 'CAD', balance: 0 },
    { name: 'Investment', type: 'investment', currency: 'CAD', balance: 0 },
  ];

// Default categories for new users with parent-child relationships
const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: 'income', parent: null },
  { name: 'Bonus', type: 'income', parent: null },
  { name: 'Interest', type: 'income', parent: null },
  { name: 'Freelance', type: 'income', parent: null },
  { name: 'Investment', type: 'income', parent: null },
  { name: 'Other Income', type: 'income', parent: null },
  
  // Expense categories with parent-child relationships
  // Home
  { name: 'Home', type: 'expense', parent: null },
  { name: 'Mortgage', type: 'expense', parent: 'Home' },
  { name: 'Rent', type: 'expense', parent: 'Home' },
  { name: 'Utilities', type: 'expense', parent: 'Home' },
  { name: 'Home Insurance', type: 'expense', parent: 'Home' },
   { name: 'Property Tax', type: 'expense', parent: 'Home'},  //New category
  
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
  { name: 'Food', type: 'expense', parent: null},
  { name: 'Groceries', type: 'expense', parent: 'Food'},
  { name: 'Dining Out', type: 'expense', parent: 'Food'},
  
  // Entertainment
  { name: 'Entertainment', type: 'expense', parent: null },
  { name: 'Games', type: 'expense', parent: 'Entertainment'},             //New category
  { name: 'Shows', type: 'expense', parent: 'Entertainment'},             //New category
  // Other
  { name: 'Education', type: 'expense', parent: null },
  { name: 'Healthcare', type: 'expense', parent: null },                  //New category?, not sure
  { name: 'Medical', type: 'expense', parent: 'Healthcare'},              //Changed from parent to child
  { name: 'Fitness', type: 'expense', parent: 'Healthcare'},              //New category

  //Dues
  { name: 'Government Dues', type: 'expense', parent: null},              //New category
  { name: 'Income Tax', type: 'expense', parent: 'Government Dues'},      //New category
  { name: 'Employment Insurance', type: 'expense', parent: 'Government Dues'},   //New category
  { name: 'Canadian Pension Plan', type: 'expense', parent: 'Government Dues'},   //New category
  
  { name: 'Work Dues', type: 'expense', parent: null},                    //New category
  { name: 'Work Pension', type: 'expense', parent: 'Work Dues'},          //New category
  { name: 'Benefit Dues', type: 'expense', parent: 'Work Dues'},          //New category

  { name: 'Other Expense', type: 'expense', parent: null },               //Delete 'Other' but keep 'Other Expense' 
];

// TODO: Implement user creation logic
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
      return sequelize.transaction(async (t) => {
          const hash = await bcrypt.hash(data.password, 10);
          const existing = await User.findOne({ 
            where: { email: data.email},
            transaction: t
          });
          if (existing) throw new Error("Email already registered.");
          const user = await User.create({
          username: data.username,
          email: data.email,
          passwordHash: hash,
        }, { transaction: t}); 

  // Create default categories with parent-child relationships
  // First pass: create all parent categories (where parent is null)
  const categoryMap = new Map<string, string>(); // Maps category name to ID
  
  // Create parent categories first
  const parentCategories = DEFAULT_CATEGORIES.filter(cat => cat.parent === null);
  for (const cat of parentCategories) {
    const created = await Category.create({
      userId: user.id,
      name: cat.name,
      type: cat.type as 'income' | 'expense',
      parentId: null,
    }, { transaction: t });
    categoryMap.set(cat.name, created.id);
  }
  
  // Create child categories with parentId
  const childCategories = DEFAULT_CATEGORIES.filter(cat => cat.parent !== null);
  for (const cat of childCategories) {
    const parentId = categoryMap.get(cat.parent!);
    if (parentId) {
      await Category.create({
        userId: user.id,
        name: cat.name,
        type: cat.type as 'income' | 'expense',
        parentId: parentId,
      }, { transaction: t});
    }
  }

  // Create default accounts for new user
  // for (const acc of DEFAULT_ACCOUNTS) {
  // const existingAccount = await Account.findOne({
  //   where: { userId: user.id, name: acc.name},
  //   transaction: t
  // });
  // if (!existingAccount) {
  // await Promise.all(
  //     DEFAULT_ACCOUNTS.map((acc) =>
  //       Account.create(
  //         {
  //           userId: user.id,
  //           name: acc.name,
  //           type: acc.type,
  //           currency: acc.currency,
  //           initialBalance: acc.balance,
  //           balance: acc.balance,
  //       }, 
  //       { transaction: t })
  //       )
  //     );
  //   }
  // }
  for (const acc of DEFAULT_ACCOUNTS) {
      await Account.findOrCreate({
        where: { userId: user.id, name: acc.name },
        defaults: {
          userId: user.id,
          name: acc.name,
          type: acc.type,
          currency: acc.currency,
          initialBalance: acc.balance,
          balance: acc.balance
        },
        transaction: t
      });
    }
  return user;
  });
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email} });

  if(!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if(!valid) throw new Error( 'Invalid password');

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('No secret key defined');
  }

  const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, secretKey, { expiresIn: '1d' });

  return { user, token };
}
