import sequelize from '../config/connection';
import { Account, initAccountModel } from './accounts';
import { User, initUserModel } from './user';
import { Transaction, initTransactionModel } from './transaction';
import { Category, initCategoryModel } from './category';
import { Budget, initBudgetModel } from './budget';

/**
 * Initialize all models and set up associations.
 * Call this once on application startup before using the models.
 */
export async function initializeModels() {
  // 1. Initialize all models
  initUserModel(sequelize);
  initAccountModel(sequelize);
  initTransactionModel(sequelize);
  initCategoryModel(sequelize);
  initBudgetModel(sequelize);
  
  // Set up associations

  // User associations
  User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
  User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
  User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });

  // Account associations
  Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
  Transaction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

  // Category associations
  Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Category.hasMany(Transaction, { foreignKey: 'categoryId', as: 'transactions' });

  // Budget association
  User.hasMany(Budget, { foreignKey: 'userId', as: 'budgets'});
  Budget.belongsTo(User, { foreignKey: 'userId', as: 'user'});

  Category.hasMany(Budget, {foreignKey: 'categoryId', as: 'budgets'});
  Budget.belongsTo(Category, { foreignKey: 'categoryId', as: 'category'});

  return { sequelize, User, Account, Transaction, Category, Budget };
}

export { sequelize, Account, User, Transaction, Category, Budget };