"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = require("nodemailer");
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
exports.default = transporter;
