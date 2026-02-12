import { User, Category, Account } from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Default accounts for new users
const DEFAULT_ACCOUNTS = [
  { name: 'Checking Account', type: 'checking', currency: 'CAD', balance: 0 },
  { name: 'Savings Account', type: 'savings', currency: 'CAD', balance: 0 },
  { name: 'Credit Card', type: 'credit', currency: 'CAD', balance: 0 },
  { name: 'Investment', type: 'credit', currency: 'CAD', balance: 0 },
];

// Default categories for new users with parent-child relationships
const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: 'income', parent: null },
  { name: 'Bonus', type: 'income', parent: null },
  { name: 'Interest', type: 'income', parent: null },
  { name: 'Freelance', type: 'income', parent: null },
  { name: 'Investment', type: 'income', parent: null },
  { name: 'Other', type: 'income', parent: null },
  
  // Expense categories with parent-child relationships
  // Home
  { name: 'Home', type: 'expense', parent: null },
  { name: 'Mortgage', type: 'expense', parent: 'Home' },
  { name: 'Rent', type: 'expense', parent: 'Home' },
  { name: 'Utilities', type: 'expense', parent: 'Home' },
  { name: 'Home Insurance', type: 'expense', parent: 'Home' },
  
  // Transportation
  { name: 'Transportation', type: 'expense', parent: null },
  { name: 'Public Transit', type: 'expense', parent: 'Transportation' },
  { name: 'Car', type: 'expense', parent: 'Transportation' },
  { name: 'Car Loan', type: 'expense', parent: 'Transportation' },
  { name: 'Car Insurance', type: 'expense', parent: 'Transportation' },
  { name: 'Gas', type: 'expense', parent: 'Transportation' },
  
  // Travel
  { name: 'Travel', type: 'expense', parent: null },
  { name: 'Vacation', type: 'expense', parent: 'Travel' },
  
  // Entertainment
  { name: 'Entertainment', type: 'expense', parent: null },
  { name: 'Dining Out', type: 'expense', parent: 'Entertainment' },
  
  // Other
  { name: 'Education', type: 'expense', parent: null },
  { name: 'Medical', type: 'expense', parent: null },
  { name: 'Other Insurance', type: 'expense', parent: null },
];

// TODO: Implement user creation logic
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const hash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash: hash,
  });

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
    });
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
      });
    }
  }

  // Create default accounts for new user
  await Promise.all(
    DEFAULT_ACCOUNTS.map((acc) =>
      Account.create({
        userId: user.id,
        name: acc.name,
        type: acc.type as any,
        currency: acc.currency,
        initialBalance: acc.balance,
        balance: acc.balance,
      })
    )
  );

  return user;
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

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1d' });

  return { user, token };
}
