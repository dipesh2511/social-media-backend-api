import express from "express";
import UserController from "./user.controller.js";
import { multerProfilePictureMiddleware } from "../../middleware/custome.multer.middleware.js";

let secureUserRouter = express.Router();
let userController = new UserController();

secureUserRouter.get("/get-details/:userId", async (req, res, next) => {
  userController.getDetails(req, res, next);
});

secureUserRouter.get("/get-all-details", async (req, res, next) => {
  userController.getAllDetails(req, res, next);
});

secureUserRouter.put(
  "/update-details/:userId",
  multerProfilePictureMiddleware,
  async (req, res, next) => {
    userController.updateDetails(req, res, next);
  }
);

secureUserRouter.post("/logout", async (req, res, next) => {
  userController.logout(req, res, next);
});

secureUserRouter.post("/logout-all-devices", async (req, res, next) => {
  userController.logoutAllDevices(req, res, next);
});

export default secureUserRouter;
