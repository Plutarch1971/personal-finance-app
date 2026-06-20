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
exports.createTransaction = createTransaction;
exports.getTransactionByUser = getTransactionByUser;
exports.updateTransaction = updateTransaction;
exports.getTransactionById = getTransactionById;
exports.deleteTransaction = deleteTransaction;
var connection_1 = require("../config/connection");
var models_1 = require("../models");
function createTransaction(data) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, connection_1.default.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                    var account, signedAmount, transaction, destination;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, models_1.Account.findByPk(data.accountId, { transaction: t })];
                            case 1:
                                account = _a.sent();
                                if (!account)
                                    throw new Error('Account not found');
                                if (data.type === 'transfer') {
                                    if (!data.toAccountId) {
                                        throw new Error('Destination account required for transfer');
                                    }
                                    if (data.accountId === data.toAccountId) {
                                        throw new Error('Cannot transfer to same account');
                                    }
                                }
                                signedAmount = data.amount;
                                if (data.type === 'expense') {
                                    signedAmount = -Math.abs(data.amount);
                                }
                                if (data.type === 'income') {
                                    signedAmount = Math.abs(data.amount);
                                }
                                if (data.type === 'transfer') {
                                    signedAmount = Math.abs(data.amount);
                                    data.categoryId = undefined;
                                }
                                return [4 /*yield*/, models_1.Transaction.create({
                                        userId: data.userId,
                                        type: data.type,
                                        accountId: data.accountId,
                                        toAccountId: data.toAccountId || null,
                                        categoryId: data.type === 'transfer' ? undefined : data.categoryId,
                                        amount: signedAmount,
                                        description: data.description,
                                        transactionDate: data.transactionDate,
                                    }, { transaction: t })];
                            case 2:
                                transaction = _a.sent();
                                if (!(data.type === 'transfer')) return [3 /*break*/, 6];
                                return [4 /*yield*/, models_1.Account.findByPk(data.toAccountId, { transaction: t })];
                            case 3:
                                destination = _a.sent();
                                if (!destination) {
                                    throw new Error('Destination account not found');
                                }
                                // subtract from source
                                return [4 /*yield*/, account.update({ balance: Number(account.balance) - Math.abs(data.amount) }, { transaction: t })];
                            case 4:
                                // subtract from source
                                _a.sent();
                                // add to destination
                                return [4 /*yield*/, destination.update({ balance: Number(destination.balance) + Math.abs(data.amount) }, { transaction: t })];
                            case 5:
                                // add to destination
                                _a.sent();
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, account.update({ balance: Number(account.balance) + signedAmount }, { transaction: t })];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8: return [2 /*return*/, transaction];
                        }
                    });
                }); })];
        });
    });
}
function getTransactionByUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, models_1.Transaction.findAll({
                    where: { userId: userId },
                    order: [['transactionDate', 'DESC']],
                })];
        });
    });
}
function updateTransaction(id, userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, connection_1.default.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                    var transaction, account, destination, updatePayload, newAccount, destination;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, models_1.Transaction.findOne({
                                    where: { id: id, userId: userId },
                                    transaction: t
                                })];
                            case 1:
                                transaction = _a.sent();
                                if (!transaction) {
                                    throw new Error("Transaction not found");
                                }
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.accountId, { transaction: t })];
                            case 2:
                                account = _a.sent();
                                if (!account) {
                                    throw new Error("Account not found");
                                }
                                if (!(transaction.type === 'transfer')) return [3 /*break*/, 6];
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.toAccountId, { transaction: t })];
                            case 3:
                                destination = _a.sent();
                                if (!destination) {
                                    throw new Error('Destination account not found');
                                }
                                return [4 /*yield*/, account.update({ balance: Number(account.balance) + Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, destination.update({ balance: Number(destination.balance) - Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 5:
                                _a.sent();
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, account.update({ balance: Number(account.balance) - Number(transaction.amount) }, { transaction: t })];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8:
                                updatePayload = {};
                                if (data.accountId !== undefined)
                                    updatePayload.accountId = data.accountId;
                                if (data.toAccountId !== undefined)
                                    updatePayload.toAccountId = data.toAccountId;
                                if (data.type !== undefined)
                                    updatePayload.type = data.type;
                                if (data.categoryId !== undefined)
                                    updatePayload.categoryId = data.categoryId;
                                if (data.amount !== undefined)
                                    updatePayload.amount = data.amount;
                                if (data.description !== undefined)
                                    updatePayload.description = data.description;
                                if (data.transactionDate !== undefined)
                                    updatePayload.transactionDate = data.transactionDate;
                                return [4 /*yield*/, transaction.update(updatePayload, { transaction: t })];
                            case 9:
                                _a.sent();
                                return [4 /*yield*/, transaction.reload({ transaction: t })];
                            case 10:
                                _a.sent();
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.accountId, { transaction: t })];
                            case 11:
                                newAccount = _a.sent();
                                if (!(transaction.type === 'transfer')) return [3 /*break*/, 15];
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.toAccountId, { transaction: t })];
                            case 12:
                                destination = _a.sent();
                                if (!destination) {
                                    throw new Error('Destination account not found.');
                                }
                                return [4 /*yield*/, newAccount.update({ balance: Number(newAccount.balance) - Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 13:
                                _a.sent();
                                return [4 /*yield*/, destination.update({ balance: Number(destination.balance) + Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 14:
                                _a.sent();
                                return [3 /*break*/, 17];
                            case 15: return [4 /*yield*/, newAccount.update({ balance: Number(newAccount.balance) + Number(transaction.amount) }, { transaction: t })];
                            case 16:
                                _a.sent();
                                _a.label = 17;
                            case 17: return [2 /*return*/, transaction];
                        }
                    });
                }); })];
        });
    });
}
function getTransactionById(id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, models_1.Transaction.findOne({
                        where: { id: id, userId: userId },
                    })];
                case 1:
                    transaction = _a.sent();
                    if (!transaction) {
                        throw new Error('Transaction not found');
                    }
                    return [2 /*return*/, transaction];
            }
        });
    });
}
function deleteTransaction(id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, connection_1.default.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                    var transaction, account, destination;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, models_1.Transaction.findOne({
                                    where: { id: id, userId: userId },
                                    transaction: t,
                                })];
                            case 1:
                                transaction = _a.sent();
                                if (!transaction) {
                                    throw new Error('Transaction not found');
                                }
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.accountId, {
                                        transaction: t,
                                    })];
                            case 2:
                                account = _a.sent();
                                if (!account) {
                                    throw new Error('Account not found');
                                }
                                if (!(transaction.type === 'transfer')) return [3 /*break*/, 6];
                                return [4 /*yield*/, models_1.Account.findByPk(transaction.toAccountId, {
                                        transaction: t
                                    })];
                            case 3:
                                destination = _a.sent();
                                if (!destination) {
                                    throw new Error('Destination account not found');
                                }
                                // restore source account
                                return [4 /*yield*/, account.update({ balance: Number(account.balance) + Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 4:
                                // restore source account
                                _a.sent();
                                // remove from destination account
                                return [4 /*yield*/, destination.update({ balance: Number(destination.balance) - Math.abs(Number(transaction.amount)) }, { transaction: t })];
                            case 5:
                                // remove from destination account
                                _a.sent();
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, account.update({ balance: Number(account.balance) - Number(transaction.amount) }, { transaction: t })];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8:
                                ;
                                //Delete the transaction
                                return [4 /*yield*/, transaction.destroy({ transaction: t })];
                            case 9:
                                //Delete the transaction
                                _a.sent();
                                return [2 /*return*/, { message: 'Transaction deletd successfully' }];
                        }
                    });
                }); })];
        });
    });
}
