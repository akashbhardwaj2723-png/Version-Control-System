
const express =require("express");
const repoController = require ("../controllers/repoController");

const repoRouter = express.Router();

repoRouter .post("/repo/create", repoController.createrepository);
repoRouter .get("/repo/all", repoController.getAllRepositories);
repoRouter .get("/repo/:id", repoController.fatchRepositoriesById);
repoRouter .get("/repo/name/:name", repoController.fatchRepositoriesByName)
repoRouter .get("/repo/user/:userId", repoController.fatchRepositoriesForCurrUser);
repoRouter .put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter .delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter .patch("/repo/toggle/:id", repoController.toggleVisibilityById);



module.exports = repoRouter ;
