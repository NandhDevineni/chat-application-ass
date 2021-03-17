var express = require('express');
var UserRouter = express.Router();

var UserController = require('../Controller/user.controller');

UserRouter.get('/',UserController.test);

UserRouter.get('/all',UserController.getAll);

UserRouter.get('/:userId',UserController.getOneByID);

UserRouter.get('/email/:email',UserController.getOneByEmail);

UserRouter.post("/signup", UserController.createUser);

UserRouter.post("/signIn", UserController.signIn);

UserRouter.put("/update/:userId",UserController.updateUser);

UserRouter.put("/forget/:userId",UserController.forgetPassword);

UserRouter.delete("/:userId",UserController.deleteUser);


module.exports = UserRouter;