"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
exports.initCategoryModel = initCategoryModel;
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
function initCategoryModel(sequelize) {
    Category.init({
        categoryId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
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
            type: sequelize_1.DataTypes.ENUM('Expense', 'Income'),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Category',
        timestamps: true,
    });
    return Category;
}
