"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
exports.initAccountModel = initAccountModel;
const sequelize_1 = require("sequelize");
class Account extends sequelize_1.Model {
}
exports.Account = Account;
function initAccountModel(sequelize) {
    Account.init({
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('checking', 'savings', 'credit', 'cash', 'investment'),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            validate: {
                len: [3, 3],
            },
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            defaultValue: 0.00,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Account',
        timestamps: true,
        indexes: [
            { unique: true, fields: ['userId', 'name'] },
        ],
    });
}
