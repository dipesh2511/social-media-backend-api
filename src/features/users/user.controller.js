import { applySalting, tc } from "../../common/common.function.js";
import {
  ERROR_TYPE,
  OPERATION_STATUS,
  RESPONSE_CODES,
  RESPONSE_MESSAGES,
} from "../../common/common.variable.js";
import GenericErrorResponse from "../../error.response.handler/custom.application.level.error.js";
import GenericApplicationResponse from "../../error.response.handler/custom.application.level.response.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
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
      firstName,
      lastName,
      profilePicture,
      bio
    );

    let [error, data] = await tc(this.userRepository.signUp(user));

    if (error || !data || data instanceof GenericErrorResponse) {
      next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.USER_NOT_CREATED,
          RESPONSE_CODES.SERVER_ERROR,
          ERROR_TYPE.INTERNAL_ERROR,
          "User not created due to some error we'll check and let you know"
        )
      );
    }

    res
      .status(RESPONSE_CODES.CREATED)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_SIGNUP_SUCCESS,
          OPERATION_STATUS.CREATE,
          RESPONSE_CODES.CREATED,
          data
        )
      );
  }

  async signIn(req, res, next) {}

  // not secure path ended here
}
