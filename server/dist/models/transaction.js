"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
exports.initTransactionModel = initTransactionModel;
const sequelize_1 = require("sequelize");
class Transaction extends sequelize_1.Model {
}
exports.Transaction = Transaction;
function initTransactionModel(sequelize) {
    Transaction.init({
        transactionId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Transaction',
        timestamps: true,
    });
    return Transaction;
}
