"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = __importDefault(require("./config/connection"));
const models_1 = require("./models");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await connection_1.default.authenticate();
        console.log('Database authenticated');
        await (0, models_1.initializeModels)();
        console.log('Models initialized with associations');
        // Uncomment in development to auto-sync schema (use migrations in production)
        // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        app_1.default.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
