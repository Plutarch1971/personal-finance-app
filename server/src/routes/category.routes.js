"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var controller = require("../controllers/category.controller");
var router = (0, express_1.Router)();
// Category routes will go here
router.post('/', auth_1.authenticateToken, controller.createCategory);
router.get('/', auth_1.authenticateToken, controller.getCategories);
// router.post('categories', authenticateToken, controller.createCategoryByUser);
router.delete('/:id', auth_1.authenticateToken, controller.deleteCategory);
router.put('/:id', auth_1.authenticateToken, controller.updateCategory);
exports.default = router;
