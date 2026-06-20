"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getBudgetTemplate = getBudgetTemplate;
exports.generateAutoBudget = generateAutoBudget;
exports.saveBudget = saveBudget;
exports.getBudget = getBudget;
var models_1 = require("../models");
var connection_1 = require("../config/connection");
var sequelize_1 = require("sequelize");
var categories_1 = require("../constants/categories");
function getBudgetTemplate(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var parentCategories, designatedParentNames, template, seenNames, _i, parentCategories_1, c, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, models_1.Category.findAll({
                            where: {
                                userId: (_a = {}, _a[sequelize_1.Op.or] = [userId, null], _a),
                                type: 'expense',
                                parentId: (_b = {}, _b[sequelize_1.Op.is] = null, _b)
                            },
                            order: [['name', 'ASC'], ['userId', 'DESC']]
                        })];
                case 1:
                    parentCategories = _c.sent();
                    designatedParentNames = new Set(categories_1.DEFAULT_CATEGORIES
                        .filter(function (cat) { return cat.type === 'expense' && cat.parent === null; })
                        .map(function (cat) { return cat.name; }));
                    template = [];
                    seenNames = new Set();
                    for (_i = 0, parentCategories_1 = parentCategories; _i < parentCategories_1.length; _i++) {
                        c = parentCategories_1[_i];
                        if (!seenNames.has(c.name) && designatedParentNames.has(c.name)) {
                            template.push({
                                categoryId: String(c.id),
                                name: c.name,
                                amount: 0
                            });
                            seenNames.add(c.name);
                        }
                    }
                    return [2 /*return*/, template];
                case 2:
                    error_1 = _c.sent();
                    console.error('Error in getBudgetTemplate:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function generateAutoBudget(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var template, results, parentMap_1, regroupedResults_1, _i, _a, r, name_1, parentName, budgets, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getBudgetTemplate(userId)];
                case 1:
                    template = _b.sent();
                    return [4 /*yield*/, connection_1.default.query("\n            SELECT\n                COALESCE(parent.name, child.name) AS \"name\",\n                SUM(ABS(t.amount)) AS total\n            FROM \"Transactions\" t\n            JOIN \"Categories\" child ON t.\"categoryId\" = child.id\n            LEFT JOIN \"Categories\" parent ON child.\"parentId\" = parent.id\n            WHERE t.\"userId\" = :userId\n                AND t.\"type\" = 'expense'\n                AND DATE_TRUNC('month', t.\"transactionDate\") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')\n            GROUP BY COALESCE(parent.name, child.name)\n            ", {
                            replacements: { userId: userId },
                            type: sequelize_1.QueryTypes.SELECT
                        })];
                case 2:
                    results = _b.sent();
                    if (!(!results || results.length === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, connection_1.default.query("\n                SELECT\n                    COALESCE(parent.name, child.name) AS \"name\",\n                    SUM(ABS(t.amount)) AS total\n                FROM \"Transactions\" t\n                JOIN \"Categories\" child ON t.\"categoryId\" = child.id\n                LEFT JOIN \"Categories\" parent ON child.\"parentId\" = parent.id\n                WHERE t.\"userId\" = :userId\n                    AND t.\"type\" = 'expense'\n                    AND DATE_TRUNC('month', t.\"transactionDate\") = DATE_TRUNC('month', CURRENT_DATE)\n                GROUP BY COALESCE(parent.name, child.name)\n                ", {
                            replacements: { userId: userId },
                            type: sequelize_1.QueryTypes.SELECT
                        })];
                case 3:
                    results = _b.sent();
                    _b.label = 4;
                case 4:
                    parentMap_1 = new Map();
                    categories_1.DEFAULT_CATEGORIES.forEach(function (cat) {
                        if (cat.parent) {
                            parentMap_1.set(cat.name, cat.parent);
                        }
                    });
                    regroupedResults_1 = new Map();
                    for (_i = 0, _a = results; _i < _a.length; _i++) {
                        r = _a[_i];
                        name_1 = r.name;
                        parentName = parentMap_1.get(name_1) || name_1;
                        regroupedResults_1.set(parentName, (regroupedResults_1.get(parentName) || 0) + Number(r.total));
                    }
                    budgets = template.map(function (t) {
                        var total = regroupedResults_1.get(t.name) || 0;
                        return __assign(__assign({}, t), { amount: total * 0.9 });
                    });
                    return [2 /*return*/, budgets];
                case 5:
                    error_2 = _b.sent();
                    console.error('Error in generateAutoBudget:', error_2);
                    throw error_2;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function saveBudget(userId, budgets) {
    return __awaiter(this, void 0, void 0, function () {
        var month;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = new Date().toISOString().slice(0, 7) + '-01';
                    // Clear existing budget for the month to ensure only the new set is saved
                    return [4 /*yield*/, models_1.Budget.destroy({
                            where: { userId: userId, month: month }
                        })];
                case 1:
                    // Clear existing budget for the month to ensure only the new set is saved
                    _a.sent();
                    return [4 /*yield*/, Promise.all(budgets.map(function (b) {
                            return models_1.Budget.create({
                                userId: userId,
                                categoryId: b.categoryId,
                                amount: b.amount,
                                month: month
                            });
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getBudget(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, models_1.Budget.scope('currentMonth').findAll({
                    where: { userId: userId },
                    include: [{ model: models_1.Category, as: 'category', attributes: ['name'] }]
                })];
        });
    });
}
