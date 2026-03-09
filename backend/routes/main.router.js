const express = require('express');
const mainRouter = express.Router();

app.get("/", (req, res) => {
    res.send("welcome to versionloop backend");
});

module.exports = mainRouter;