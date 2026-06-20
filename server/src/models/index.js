"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = exports.Category = exports.Transaction = exports.User = exports.Account = exports.sequelize = void 0;
exports.initializeModels = initializeModels;
var connection_1 = require("../config/connection");
exports.sequelize = connection_1.default;
var accounts_1 = require("./accounts");
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return accounts_1.Account; } });
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
var transaction_1 = require("./transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return transaction_1.Transaction; } });
var category_1 = require("./category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return category_1.Category; } });
var budget_1 = require("./budget");
Object.defineProperty(exports, "Budget", { enumerable: true, get: function () { return budget_1.Budget; } });
/**
 * Initialize all models and set up associations.
 * Call this once on application startup before using the models.
 */
function initializeModels() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // 1. Initialize all models
            (0, user_1.initUserModel)(connection_1.default);
            (0, accounts_1.initAccountModel)(connection_1.default);
            (0, transaction_1.initTransactionModel)(connection_1.default);
            (0, category_1.initCategoryModel)(connection_1.default);
            (0, budget_1.initBudgetModel)(connection_1.default);
            // Set up associations
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
            // Budget association
            user_1.User.hasMany(budget_1.Budget, { foreignKey: 'userId', as: 'budgets' });
            budget_1.Budget.belongsTo(user_1.User, { foreignKey: 'userId', as: 'user' });
            category_1.Category.hasMany(budget_1.Budget, { foreignKey: 'categoryId', as: 'budgets' });
            budget_1.Budget.belongsTo(category_1.Category, { foreignKey: 'categoryId', as: 'category' });
            return [2 /*return*/, { sequelize: connection_1.default, User: user_1.User, Account: accounts_1.Account, Transaction: transaction_1.Transaction, Category: category_1.Category, Budget: budget_1.Budget }];
        });
    });
}
