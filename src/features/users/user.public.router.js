import express from "express";
import UserController from "./user.controller.js";

let publicUserRouter = express.Router();
let userController = new UserController();

publicUserRouter.post("/signup", async (req, res, next) => {
  userController.signUp(req, res, next);
});

publicUserRouter.post("/signin", async (req, res, next) => {
  userController.signIn(req, res, next);
});

export default publicUserRouter;
