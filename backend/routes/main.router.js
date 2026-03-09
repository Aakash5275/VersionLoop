const express = require('express');
const userRouter = require('./user.router');

const mainRouter = express.Router();

// 1. Mount the userRouter
mainRouter.use(userRouter);

// 2. FIX: Change 'app.get' to 'mainRouter.get'
mainRouter.get("/", (req, res) => {
    res.send("welcome ");
});

module.exports = mainRouter;