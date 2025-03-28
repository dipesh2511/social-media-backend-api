import { applySalting } from "../../common/common.function.js";
import {
  ERROR_TYPE,
  RESPONSE_CODES,
  RESPONSE_MESSAGES,
} from "../../common/common.variable.js";
import GenericErrorResponse from "../../error.response.handler/custom.application.level.error.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepositoy = new UserRepository();
  }

  // secure paths started here
  async getDetails(req, res, next) {}

  async getAllDetails(req, res, next) {}

  async updateDetails(req, res, next) {}

  async logout(req, res, next) {}

  async logoutAllDevices(req, res, next) {}

  // secure paths ended here

  // not secure path started here

  async signUp(req, res, next) {
    let {
      username,
      email,
      password,
      firstName,
      lastName,
      profilePicture,
      bio,
    } = req.body;
    console.log(req.body);

    if (!password) {
      next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.BAD_REQUEST,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "Password is not present in the request body"
        )
      );
    }
    let new_password = await applySalting(password);

    let user = UserModel.signUp(
      username,
      email,
      new_password,
      (firstName = "null"),
      (lastName = "null"),
      (profilePicture = "null"),
      (bio = "null")
    );
    res.send(user);
  }

  async signIn(req, res, next) {}

  // not secure path ended here
}
