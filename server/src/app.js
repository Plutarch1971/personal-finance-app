"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var routes_1 = require("./routes");
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.default = app;
