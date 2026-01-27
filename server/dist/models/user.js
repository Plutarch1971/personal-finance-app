"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.initUserModel = initUserModel;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
function initUserModel(sequelize) {
    User.init({
        id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
        email: sequelize_1.DataTypes.STRING,
        password: sequelize_1.DataTypes.STRING,
    }, {
        sequelize,
        timestamps: true
    });
    return User;
}
