"use strict";
module.exports = {
    development: {
        username: "postgres",
        password: process.env.DB_PASSWORD,
        database: "personal_financedb",
        host: "127.0.0.1",
        dialect: "postgres"
    }
};
