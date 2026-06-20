"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var receipt_ai_controller_1 = require("../controllers/receipt-ai.controller");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
var upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (_req, file, cb) {
        var ok = file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/webp';
        if (!ok) {
            return cb(new Error('Only JPEG, PNG, WEBP allowed'));
        }
        cb(null, true);
    }
});
router.post('/extract', auth_1.authenticateToken, upload.single('receipt'), receipt_ai_controller_1.extractReceipt);
router.post('/confirm', auth_1.authenticateToken, receipt_ai_controller_1.confirmReceiptToTransaction);
exports.default = router;
