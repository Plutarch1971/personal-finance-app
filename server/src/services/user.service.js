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
exports.resetPassword = exports.forgotPassword = void 0;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
//user.service.ts
var models_1 = require("../models");
var connection_1 = require("../config/connection");
var categories_1 = require("../constants/categories");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var email_service_1 = require("./email.service");
// Default accounts for new users
var DEFAULT_ACCOUNTS = [
    { name: 'Checking Account', type: 'checking', currency: 'CAD', balance: 0 },
    { name: 'Savings Account', type: 'savings', currency: 'CAD', balance: 0 },
    { name: 'Credit Card', type: 'credit', currency: 'CAD', balance: 0 },
    //Investment Accounts
    { name: 'TFSA', type: 'investment', currency: 'CAD', balance: 0 },
    { name: 'RRSP', type: 'investment', currency: 'CAD', balance: 0 },
    { name: 'RESP', type: 'investment', currency: 'CAD', balance: 0 },
    { name: 'Bonds', type: 'investment', currency: 'CAD', balance: 0 },
    { name: 'Stocks', type: 'investment', currency: 'CAD', balance: 0 },
    { name: 'GIC', type: 'investment', currency: 'CAD', balance: 0 },
];
// TODO: Implement user creation logic
function registerUser(data) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, connection_1.default.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                    var hash, existing, user, categoryMap, parentCategories, _i, parentCategories_1, cat, created, childCategories, _a, childCategories_1, cat, parentId, _b, DEFAULT_ACCOUNTS_1, acc;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, bcrypt_1.default.hash(data.password, 10)];
                            case 1:
                                hash = _c.sent();
                                return [4 /*yield*/, models_1.User.findOne({
                                        where: { email: data.email },
                                        transaction: t
                                    })];
                            case 2:
                                existing = _c.sent();
                                if (existing)
                                    throw new Error("Email already registered.");
                                return [4 /*yield*/, models_1.User.create({
                                        username: data.username,
                                        email: data.email,
                                        passwordHash: hash,
                                    }, { transaction: t })];
                            case 3:
                                user = _c.sent();
                                categoryMap = new Map();
                                parentCategories = categories_1.DEFAULT_CATEGORIES.filter(function (cat) { return cat.parent === null; });
                                _i = 0, parentCategories_1 = parentCategories;
                                _c.label = 4;
                            case 4:
                                if (!(_i < parentCategories_1.length)) return [3 /*break*/, 7];
                                cat = parentCategories_1[_i];
                                return [4 /*yield*/, models_1.Category.create({
                                        userId: user.id,
                                        name: cat.name,
                                        type: cat.type,
                                        parentId: null,
                                    }, { transaction: t })];
                            case 5:
                                created = _c.sent();
                                categoryMap.set(cat.name, created.id);
                                _c.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 4];
                            case 7:
                                childCategories = categories_1.DEFAULT_CATEGORIES.filter(function (cat) { return cat.parent !== null; });
                                _a = 0, childCategories_1 = childCategories;
                                _c.label = 8;
                            case 8:
                                if (!(_a < childCategories_1.length)) return [3 /*break*/, 11];
                                cat = childCategories_1[_a];
                                parentId = categoryMap.get(cat.parent);
                                if (!parentId) return [3 /*break*/, 10];
                                return [4 /*yield*/, models_1.Category.create({
                                        userId: user.id,
                                        name: cat.name,
                                        type: cat.type,
                                        parentId: parentId,
                                    }, { transaction: t })];
                            case 9:
                                _c.sent();
                                _c.label = 10;
                            case 10:
                                _a++;
                                return [3 /*break*/, 8];
                            case 11:
                                _b = 0, DEFAULT_ACCOUNTS_1 = DEFAULT_ACCOUNTS;
                                _c.label = 12;
                            case 12:
                                if (!(_b < DEFAULT_ACCOUNTS_1.length)) return [3 /*break*/, 15];
                                acc = DEFAULT_ACCOUNTS_1[_b];
                                return [4 /*yield*/, models_1.Account.findOrCreate({
                                        where: { userId: user.id, name: acc.name },
                                        defaults: {
                                            userId: user.id,
                                            name: acc.name,
                                            type: acc.type,
                                            currency: acc.currency,
                                            initialBalance: acc.balance,
                                            balance: acc.balance
                                        },
                                        transaction: t
                                    })];
                            case 13:
                                _c.sent();
                                _c.label = 14;
                            case 14:
                                _b++;
                                return [3 /*break*/, 12];
                            case 15: return [2 /*return*/, user];
                        }
                    });
                }); })];
        });
    });
}
function loginUser(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, valid, secretKey, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, models_1.User.findOne({ where: { email: email } })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new Error('User not found');
                    return [4 /*yield*/, bcrypt_1.default.compare(password, user.passwordHash)];
                case 2:
                    valid = _a.sent();
                    if (!valid)
                        throw new Error('Invalid password');
                    secretKey = process.env.JWT_SECRET;
                    if (!secretKey) {
                        throw new Error('No secret key defined');
                    }
                    token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, secretKey, { expiresIn: '1d' });
                    return [2 /*return*/, { user: user, token: token }];
            }
        });
    });
}
//---------------------------FORGOT PASSWORD SERVICE ---------------------- 
var forgotPassword = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, resetLink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.User.findOne({
                    where: { email: email }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/];
                }
                token = crypto_1.default.randomBytes(32).toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = new Date(Date.now() + 3600000);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                resetLink = "".concat(process.env.FRONTEND_URL, "/reset-password/").concat(token);
                return [4 /*yield*/, (0, email_service_1.sendPasswordResetEmail)(user.email, resetLink)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
//--------------------------- RESET PASSWORD SERVICE-------------------
var resetPassword = function (token, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.User.findOne({
                    where: {
                        resetPasswordToken: token
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error('INVALID_TOKEN');
                }
                if (!user.resetPasswordExpires ||
                    user.resetPasswordExpires < new Date()) {
                    throw new Error('TOKEN_EXPIRED');
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hash = _a.sent();
                user.passwordHash = hash;
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
