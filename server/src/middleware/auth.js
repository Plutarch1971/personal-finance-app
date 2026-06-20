"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
// Middleware function to authenticate JWT token
var authenticateToken = function (req, res, next) {
    // Get the authorization header from the request
    var authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    // Check if the authorization header is present
    if (!authHeader) {
        console.log('No auth header');
        return res.sendStatus(401);
    }
    // Extract the token from the authorization header
    var _a = authHeader.split(' '), scheme = _a[0], token = _a[1];
    console.log('Scheme:', scheme, 'Token:', token ? token.substring(0, 20) + '...' : 'missing');
    if (scheme !== 'Bearer' || !token) {
        console.log('Invalid auth format');
        return res.sendStatus(401);
    }
    // Get the secret key from the environment variables
    var secretKey = process.env.JWT_SECRET;
    console.log('Secret key exists:', !!secretKey);
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined');
    }
    // Verify the JWT token
    try {
        var decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log('Token verified successfully:', decoded);
        // Attach the user information to the request object
        req.user = decoded;
        console.log('auth middleware attached user:', req.user);
        next(); // Call the next middleware function
    }
    catch (err) {
        console.log('Token verification failed:', err);
        return res.sendStatus(403);
    }
};
exports.authenticateToken = authenticateToken;
