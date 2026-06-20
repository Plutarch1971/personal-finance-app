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
exports.getExpensesByCategory = getExpensesByCategory;
exports.getMonthlyExpensesByCategory = getMonthlyExpensesByCategory;
exports.getMonthlySummary = getMonthlySummary;
exports.getIncomeByCategory = getIncomeByCategory;
exports.getAccountBalances = getAccountBalances;
exports.getExpenseThirty = getExpenseThirty;
exports.getMonthlyExpenseTrend = getMonthlyExpenseTrend;
var sequelize_1 = require("sequelize");
var models_1 = require("../models");
var connection_1 = require("../config/connection");
var sequelize_2 = require("sequelize");
/** Monthly income / expense summary
 */
function getExpensesByCategory(userId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection_1.default.query("\n        SELECT\n            COALESCE(parent.name, child.name) AS name,\n            SUM(ABS(t.amount)) AS value\n        FROM \"Transactions\" t\n        JOIN \"Categories\" child\n            ON t.\"categoryId\" = child.id\n        LEFT JOIN \"Categories\" parent\n            ON child.\"parentId\" = parent.id\n        WHERE t.type = 'expense'\n            AND t.\"userId\" = :userId\n            AND t.\"transactionDate\" BETWEEN :startDate AND :endDate\n        GROUP BY COALESCE(parent.name, child.name)\n        ORDER BY value DESC\n        ", {
                        replacements: { userId: userId, startDate: startDate, endDate: endDate },
                        type: sequelize_2.QueryTypes.SELECT
                    })];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
function getMonthlyExpensesByCategory(userId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection_1.default.query("\n        SELECT\n        COALESCE(parent.name, child.name) AS name,\n        SUM(ABS(t.amount)) AS value\n        FROM \"Transactions\" t\n        JOIN \"Categories\" child\n            ON t.\"categoryId\" = child.id\n        LEFT JOIN \"Categories\" parent\n            ON child.\"parentId\" = parent.id\n        WHERE t.type = 'expense'\n            AND t.\"userId\" = :userId\n            AND t.amount < 0 \n            AND t.\"transactionDate\" BETWEEN :startDate AND :endDate\n        GROUP BY COALESCE(parent.name, child.name)\n        ORDER BY value DESC\n        ", {
                        replacements: { userId: userId, startDate: startDate, endDate: endDate },
                        type: sequelize_2.QueryTypes.SELECT,
                    })];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
function getMonthlySummary(userId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var hasRange, result, row;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    hasRange = Boolean(startDate && endDate);
                    return [4 /*yield*/, connection_1.default.query("\n        SELECT\n            SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,\n            SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS expense\n        FROM  \"Transactions\"\n        WHERE \"userId\" = :userId\n            AND (\n            (:hasRange = true AND \"transactionDate\" BETWEEN :startDate AND :endDate)\n            OR\n            (:hasRange = false AND DATE_TRUNC('month', \"transactionDate\") = \n            DATE_TRUNC('month', CURRENT_DATE))\n            )\n        ", {
                            replacements: { userId: userId, startDate: startDate, endDate: endDate, hasRange: hasRange },
                            type: sequelize_2.QueryTypes.SELECT,
                        })];
                case 1:
                    result = _b.sent();
                    row = (_a = result[0]) !== null && _a !== void 0 ? _a : {};
                    return [2 /*return*/, {
                            income: Number(row.income || 0),
                            expense: Number(row.expense || 0),
                            net: Number(row.income || 0) - Number(row.expense || 0),
                        }];
            }
        });
    });
}
function getIncomeByCategory(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var end, start, startDate, endDate;
        var _a, _b;
        return __generator(this, function (_c) {
            end = new Date();
            start = new Date(end);
            start.setDate(end.getDate() - 30);
            startDate = start.toISOString().slice(0, 10);
            endDate = end.toISOString().slice(0, 10);
            return [2 /*return*/, models_1.Transaction.findAll({
                    where: {
                        userId: userId,
                        type: 'income',
                        amount: (_a = {}, _a[sequelize_1.Op.gt] = 0, _a), // income only
                        transactionDate: (_b = {},
                            _b[sequelize_1.Op.between] = [startDate, endDate],
                            _b),
                    },
                    include: [
                        {
                            model: models_1.Category,
                            as: 'category',
                            attributes: ['name'],
                        },
                    ],
                    attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('amount')), 'total']],
                    group: ['category.id', 'category.name'],
                    raw: true,
                })];
        });
    });
}
function getAccountBalances(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, models_1.Account.findAll({
                    where: { userId: userId },
                    attributes: ['id', 'name', 'type', 'balance'],
                    order: [['name', 'ASC']],
                })];
        });
    });
}
function getExpenseThirty(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var end, start, startDate, endDate, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    end = new Date();
                    start = new Date(end);
                    start.setDate(end.getDate() - 30);
                    startDate = start.toISOString().slice(0, 10);
                    endDate = end.toISOString().slice(0, 10);
                    return [4 /*yield*/, models_1.Transaction.findAll({
                            where: {
                                userId: userId,
                                amount: (_a = {}, _a[sequelize_1.Op.lt] = 0, _a),
                                transactionDate: (_b = {},
                                    _b[sequelize_1.Op.between] = [startDate, endDate],
                                    _b),
                            },
                            include: [
                                {
                                    model: models_1.Category,
                                    as: 'category',
                                    attributes: ['id', 'name'],
                                },
                            ],
                            attributes: [
                                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.fn)('ABS', (0, sequelize_1.col)('amount'))), 'total'],
                            ],
                            group: ['category.id', 'category.name'],
                            order: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.fn)('ABS', (0, sequelize_1.col)('amount'))), 'DESC']],
                        })];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function getMonthlyExpenseTrend(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection_1.default.query("\n        SELECT\n        TO_CHAR(DATE_TRUNC('month', t.\"transactionDate\"), 'Mon YYYY') AS month,\n        SUM(ABS(t.amount)) AS total\n        FROM \"Transactions\" t\n        WHERE t.\"userId\" = :userId\n            AND t.amount < 0\n            AND t.\"transactionDate\" >= NOW() - INTERVAL '6 months'\n        GROUP BY DATE_TRUNC('month', t.\"transactionDate\")\n        ORDER BY DATE_TRUNC('month', t.\"transactionDate\")\n        ", {
                        replacements: { userId: userId },
                        type: sequelize_2.QueryTypes.SELECT,
                    })];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
