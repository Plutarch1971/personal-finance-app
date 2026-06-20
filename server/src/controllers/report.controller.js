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
exports.getMonthlyExpensesByCategory = getMonthlyExpensesByCategory;
exports.getExpensesByCategory = getExpensesByCategory;
exports.getMonthlySummary = getMonthlySummary;
exports.getIncomeByCategory = getIncomeByCategory;
exports.getAccountBalances = getAccountBalances;
exports.getExpenseThirty = getExpenseThirty;
exports.getMonthlyExpenseTrend = getMonthlyExpenseTrend;
var reportService = require("../services/report.service");
function getMonthlyExpensesByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, startDate, endDate, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    startDate = req.query.startDate;
                    endDate = req.query.endDate;
                    if (!startDate || !endDate) {
                        return [2 /*return*/, res.status(400).json({ error: 'startDate and endDate required' })];
                    }
                    return [4 /*yield*/, reportService.getMonthlyExpensesByCategory(userId, startDate, endDate)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getExpensesByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, startDate, endDate, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    startDate = req.query.startDate;
                    endDate = req.query.endDate;
                    if (!startDate || !endDate) {
                        return [2 /*return*/, res.status(400).json({ error: "Start date and End date is required" })];
                    }
                    return [4 /*yield*/, reportService.getExpensesByCategory(userId, startDate, endDate)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(400).json({ error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMonthlySummary(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, startDate, endDate, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    startDate = req.query.startDate;
                    endDate = req.query.endDate;
                    return [4 /*yield*/, reportService.getMonthlySummary(userId, startDate, endDate)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).json({ error: error_3.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getIncomeByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data, error_4, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    return [4 /*yield*/, reportService.getIncomeByCategory(userId)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    message = error_4 instanceof Error ? error_4.message : 'Internal server error';
                    res.status(500).json({ error: message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAccountBalances(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, accounts, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    return [4 /*yield*/, reportService.getAccountBalances(userId)];
                case 1:
                    accounts = _a.sent();
                    res.json(accounts);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    res.status(400).json({ error: error_5.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getExpenseThirty(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    return [4 /*yield*/, reportService.getExpenseThirty(userId)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        return [2 /*return*/, res.status(404).json({ error: 'No data found.' })];
                    }
                    res.json(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, res.status(500).json(error_6.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMonthlyExpenseTrend(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    return [4 /*yield*/, reportService.getMonthlyExpenseTrend(userId)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    res.status(500).json({ error: error_7.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
