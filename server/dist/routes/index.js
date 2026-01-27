"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const account_routes_1 = __importDefault(require("./account.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const router = (0, express_1.Router)();
// Add routes here
router.use('/users', user_routes_1.default);
router.use('/accountRoutes', account_routes_1.default);
router.use('/categoryRoutes', category_routes_1.default);
router.use('/transactionRoutes', transaction_routes_1.default);
router.use('/reportRoutes', report_routes_1.default);
router.use('/authRoutes', auth_routes_1.default);
exports.default = router;
