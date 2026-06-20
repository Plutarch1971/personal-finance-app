"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
exports.initTransactionModel = initTransactionModel;
var sequelize_1 = require("sequelize");
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transaction.associateps = function (models) {
        Transaction.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category',
        });
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Transaction.belongsTo(models.Account, {
            foreignKey: 'accountId',
            as: 'account',
        });
        Transaction.belongsTo(models.Account, {
            foreignKey: 'toAccountId',
            as: 'toAccount',
        });
    };
    return Transaction;
}(sequelize_1.Model));
exports.Transaction = Transaction;
function initTransactionModel(sequelize) {
    Transaction.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('income', 'expense', 'transfer'),
            allowNull: false,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        toAccountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        modelName: 'Transaction',
        tableName: 'Transactions',
        timestamps: true,
    });
    return Transaction;
}
