"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
// Enable access to .env variables
var sequelize_1 = require("sequelize");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET;
var sequelize = process.env.DATABASE_URL
    ? new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: process.env.NODE_ENV === 'production'
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    })
    : new sequelize_1.Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        dialectOptions: {
            decimalNumbers: true,
        },
    });
exports.default = sequelize;
