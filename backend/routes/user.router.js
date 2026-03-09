const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

// Changed .signup to .signUp to match your controller's export
userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signUp); 
userRouter.post("/login", userController.login);
userRouter.get("/userProfile", userController.getUserProfile);
userRouter.put("/updateProfile", userController.updateUserProfile);
userRouter.delete("/deleteProfile", userController.deleteUserProfile);

module.exports = userRouter;