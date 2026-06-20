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
exports.Category = void 0;
exports.initCategoryModel = initCategoryModel;
// src/models/Category.ts
var sequelize_1 = require("sequelize");
var Category = /** @class */ (function (_super) {
    __extends(Category, _super);
    function Category() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Category.associate = function (models) {
        Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
        Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
        Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactioins', });
    };
    return Category;
}(sequelize_1.Model));
exports.Category = Category;
function initCategoryModel(sequelize) {
    Category.init({
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
            type: sequelize_1.DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
    }, {
        sequelize: sequelize,
        modelName: 'Category',
        tableName: 'Categories',
        timestamps: true,
    });
    return Category;
}
