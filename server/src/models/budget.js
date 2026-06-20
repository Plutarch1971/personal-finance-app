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
exports.Budget = void 0;
exports.initBudgetModel = initBudgetModel;
var sequelize_1 = require("sequelize");
var Budget = /** @class */ (function (_super) {
    __extends(Budget, _super);
    function Budget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Budget;
}(sequelize_1.Model));
exports.Budget = Budget;
function initBudgetModel(sequelize) {
    Budget.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            get: function () {
                var value = this.getDataValue('amount');
                return value ? parseFloat(String(value)) : 0;
            },
            validate: {
                isDecimal: true,
                min: { args: [0], msg: 'Amount must be >=0' }
            }
        },
        month: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize: sequelize,
        modelName: 'Budget',
        tableName: 'Budgets',
        timestamps: true,
        indexes: [{ fields: ['userId'],
                name: 'idx_budgets_user_id' },
            { unique: true,
                fields: ['userId', 'categoryId', 'month'],
                name: 'unique_user_category_month_budget' }
        ],
    });
    Budget.addScope('currentMonth', function () { return ({
        where: {
            month: new Date().toISOString().slice(0, 7) + '-01'
        }
    }); });
    return Budget;
}
