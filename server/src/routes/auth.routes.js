"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var router = (0, express_1.Router)();
// Auth routes
router.post('/register', user_controller_1.register);
router.post('/login', user_controller_1.login);
router.post('/forgot-password', user_controller_1.forgotPassword);
router.post('/reset-password/:token', user_controller_1.resetPassword);
exports.default = router;
