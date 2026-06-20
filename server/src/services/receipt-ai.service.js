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
exports.extractReceiptFromImage = extractReceiptFromImage;
var openai_1 = require("openai");
var zod_1 = require("zod");
var client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
var receiptItemSchema = zod_1.z.object({
    description: zod_1.z.string().nullable(),
    quantity: zod_1.z.coerce.number().nullable(),
    unitPrice: zod_1.z.coerce.number().nullable(),
    total: zod_1.z.coerce.number().nullable(),
});
var receiptDraftSchema = zod_1.z.object({
    merchantName: zod_1.z.string().nullable(),
    receiptDate: zod_1.z.string().nullable(), //ISO date preferred
    currency: zod_1.z.string().nullish().transform(function (val) { return val !== null && val !== void 0 ? val : 'CAD'; }),
    subtotal: zod_1.z.coerce.number().nullable(),
    tax: zod_1.z.coerce.number().nullable(),
    total: zod_1.z.coerce.number().nullable(),
    paymentMethod: zod_1.z.string().nullable(),
    items: zod_1.z.array(receiptItemSchema).nullish().transform(function (val) { return val !== null && val !== void 0 ? val : []; }),
    warnings: zod_1.z.array(zod_1.z.string()).nullish().transform(function (val) { return val !== null && val !== void 0 ? val : []; }),
});
function extractReceiptFromImage(fileBuffer, mimeType) {
    return __awaiter(this, void 0, void 0, function () {
        var base64, dataUrl, completion, content, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!process.env.OPENAI_API_KEY) {
                        throw new Error('OPENAI_API_KEY is missing');
                    }
                    base64 = fileBuffer.toString('base64');
                    dataUrl = 'data:' + mimeType + ';base64,' + base64;
                    return [4 /*yield*/, client.chat.completions.create({
                            model: process.env.OPENAI_RECEIPT_MODEL || 'gpt-4o-mini',
                            response_format: { type: 'json_object' },
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You extract receipt data and return JSON only. Use null for missing or uncertain values.',
                                },
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Extract receipt details into JSON. Fields: merchantName, receiptDate (ISO format), currency, subtotal, tax, total, paymentMethod, items[] (description, quantity, unitPrice, total). HIGH ACCURACY REQUIRED for the "total" amount—ensure it is the final grand total paid. Add warnings[] for unclear fields. Return JSON only.',
                                        },
                                        {
                                            type: 'image_url',
                                            image_url: {
                                                url: dataUrl,
                                            },
                                        },
                                    ],
                                },
                            ],
                        })];
                case 1:
                    completion = _c.sent();
                    content = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
                    if (!content) {
                        throw new Error('OpenAI returned empty content');
                    }
                    parsed = JSON.parse(content);
                    return [2 /*return*/, receiptDraftSchema.parse(parsed)];
            }
        });
    });
}
