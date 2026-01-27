"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
// Enable access to .env variables
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), 'src/config/.env') });
exports.JWT_SECRET = process.env.JWT_SECRET;
const sequelize = process.env.DB_URL
    ? new sequelize_1.Sequelize(process.env.DB_URL, {
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
