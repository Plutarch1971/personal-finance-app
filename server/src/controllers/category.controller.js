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
exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
exports.updateCategory = updateCategory;
var categoryService = require("../services/category.service");
var category_1 = require("../models/category");
function getCategories(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, type, categories, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    type = req.query.type;
                    //Validate type if present
                    if (type && type !== 'income' && type !== 'expense') {
                        return [2 /*return*/, res.status(400).json({ error: 'Invalid category type' })];
                    }
                    return [4 /*yield*/, categoryService.getCategoriesByUser(userId, type)];
                case 1:
                    categories = _a.sent();
                    res.json(categories);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to fetch categories", error_1);
                    res.status(500).json({ error: "Failed to fetch categories" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var existingCategory, userId, _a, name_1, type, parentId, category, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.user) {
                        return [2 /*return*/, res.status(401).json({ error: 'Unathorized' })];
                    }
                    return [4 /*yield*/, category_1.Category.findOne({
                            where: {
                                name: req.body.name,
                                userId: req.user.id,
                                type: req.body.type
                            }
                        })];
                case 1:
                    existingCategory = _b.sent();
                    if (existingCategory) {
                        return [2 /*return*/, res.status(400).json({ error: 'Category already exists' })];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    userId = req.user.id;
                    _a = req.body, name_1 = _a.name, type = _a.type, parentId = _a.parentId;
                    return [4 /*yield*/, categoryService.createCategory({
                            userId: userId,
                            name: name_1,
                            type: type,
                            parentId: parentId,
                        })];
                case 3:
                    category = _b.sent();
                    res.status(201).json(category);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    res.status(400).json({ error: error_2.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// export async function createCategoryByUser(req: Request, res: Response) {
//     if (!req.user) {
//         return res.status(401).json({ error: 'Unathorized'});
//     }
//     const existingCategory = await Category.findOne({
//         where: {
//             name: req.body.name,
//             userId: req.user.id,
//             type: req.body.type
//         }
//     });
//     if (existingCategory) {
//         return res.status(400).json({error: 'Category already exists'})
//     }
//     try {
//         const userId = (req.user as any).id;
//         const { name, type, parentId} = req.body;
//         const category = await categoryService.createCategoryByUser({ userId, name, type, parentId});
//         res.status(201).json(category);
//     } catch (err: any) {
//         res.status(400).json(({ error: err.message}));
//     }
// }
function deleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.user.id;
                    id = req.params.id;
                    return [4 /*yield*/, categoryService.deleteCategory(id, userId)];
                case 1:
                    _a.sent();
                    res.json({ message: 'Deleted successfully' });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    res.status(400).json({ error: err_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateCategory(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, _a, name_2, parentId, type, existing, updated, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    userId = req.user.id;
                    id = req.params.id;
                    if (!id)
                        return [2 /*return*/, res.status(400).json({ error: 'Missing category id' })];
                    _a = req.body, name_2 = _a.name, parentId = _a.parentId, type = _a.type;
                    // Basic validation
                    if (!name_2 || !type) {
                        return [2 /*return*/, res.status(400).json({ error: 'Name and type are required' })];
                    }
                    // Prevent self-parenting
                    if (parentId === id) {
                        return [2 /*return*/, res.status(400).json(({ error: 'Category cannot be its own parent' }))];
                    }
                    return [4 /*yield*/, categoryService.getCategoryById(id, userId)];
                case 1:
                    existing = _b.sent();
                    if (!existing) {
                        return [2 /*return*/, res.status(404).json({ error: 'Category not found' })];
                    }
                    if (existing.type !== type) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Cannot change category type (income/expense)',
                            })];
                    }
                    return [4 /*yield*/, categoryService.updateCategory(id, userId, {
                            name: name_2,
                            parentId: parentId || null,
                        })];
                case 2:
                    updated = _b.sent();
                    return [2 /*return*/, res.json(updated)];
                case 3:
                    error_3 = _b.sent();
                    console.error('Update category error:', error_3);
                    return [2 /*return*/, res.status(500).json({
                            error: 'Failed to update category',
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
