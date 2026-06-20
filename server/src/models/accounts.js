"use strict";
// src/models/Account.ts
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
exports.Account = void 0;
exports.initAccountModel = initAccountModel;
var sequelize_1 = require("sequelize");
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    function Account() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Account.associate = function (models) {
        Account.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Account.hasMany(models.Transaction, { foreignKey: 'accountId', as: 'transactions' });
    };
    return Account;
}(sequelize_1.Model));
exports.Account = Account;
function initAccountModel(sequelize) {
    Account.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('checking', 'savings', 'credit', 'investment'),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            validate: {
                len: [3, 3],
            },
        },
        initialBalance: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
    }, {
        sequelize: sequelize,
        modelName: 'Account',
        tableName: 'Accounts',
        timestamps: true,
        indexes: [{ fields: ['userId'] }],
    });
    return Account;
}
