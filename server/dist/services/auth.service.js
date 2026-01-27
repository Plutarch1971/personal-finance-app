"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = findUser;
const user_model_1 = require("../models/user.model");
async function findUser(id) {
    return user_model_1.User.findByPk(id);
}
