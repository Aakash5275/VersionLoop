const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

// Specific routes MUST come before wildcard /:id routes
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoryForCurrentUser);
// Generic /:id last so it doesn't shadow the above
repoRouter.get("/repo/:id", repoController.fetchRepositortById);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.post("/repo/commit/:id", repoController.commitToRepo);

module.exports = repoRouter;