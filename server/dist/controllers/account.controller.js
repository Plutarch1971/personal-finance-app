"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = getAccounts;
async function getAccounts(req, res) {
    try {
        res.json({ message: 'Get accounts endpoint' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
}
