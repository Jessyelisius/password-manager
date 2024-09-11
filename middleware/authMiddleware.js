const express = require('express')



// authMiddleware.js
const authMiddleware = (req, res, next) => {

    // Assuming you store user authentication info in the session

    if (req.session && req.session.userId) {
        next(); // User is authenticated, allow access
    } else {
        res.redirect('/auth/login'); // Redirect to login page if not authenticated
    }
};

module.exports = authMiddleware;