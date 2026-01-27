"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Transaction = exports.User = exports.Account = exports.sequelize = void 0;
exports.initializeModels = initializeModels;
const connection_1 = __importDefault(require("../config/connection"));
exports.sequelize = connection_1.default;
const accounts_1 = require("./accounts");
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return accounts_1.Account; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const transaction_1 = require("./transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return transaction_1.Transaction; } });
const category_1 = require("./category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_1.Category; } });
/**
 * Initialize all models and set up associations.
 * Call this once on application startup before using the models.
 */
async function initializeModels() {
    // 1. Initialize all models
    (0, user_1.initUserModel)(connection_1.default);
    (0, accounts_1.initAccountModel)(connection_1.default);
    (0, transaction_1.initTransactionModel)(connection_1.default);
    (0, category_1.initCategoryModel)(connection_1.default);
    // 2. Set up associations
    // User associations
    user_1.User.hasMany(accounts_1.Account, { foreignKey: 'userId', as: 'accounts' });
    user_1.User.hasMany(transaction_1.Transaction, { foreignKey: 'userId', as: 'transactions' });
    user_1.User.hasMany(category_1.Category, { foreignKey: 'userId', as: 'categories' });
    // Account associations
    accounts_1.Account.belongsTo(user_1.User, { foreignKey: 'userId', as: 'user' });
    accounts_1.Account.hasMany(transaction_1.Transaction, { foreignKey: 'accountId', as: 'transactions' });
    // Transaction associations
    transaction_1.Transaction.belongsTo(user_1.User, { foreignKey: 'userId', as: 'user' });
    transaction_1.Transaction.belongsTo(accounts_1.Account, { foreignKey: 'accountId', as: 'account' });
    transaction_1.Transaction.belongsTo(category_1.Category, { foreignKey: 'categoryId', as: 'category' });
    // Category associations
    category_1.Category.belongsTo(user_1.User, { foreignKey: 'userId', as: 'user' });
    category_1.Category.hasMany(transaction_1.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
    return { sequelize: connection_1.default, User: user_1.User, Account: accounts_1.Account, Transaction: transaction_1.Transaction, Category: category_1.Category };
}
