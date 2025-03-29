import jwt from "jsonwebtoken";
import {
  applySalting,
  checkHash,
  tc,
  jwtSign,
} from "../../common/common.function.js";
import {
  ERROR_TYPE,
  OPERATION_STATUS,
  RESPONSE_CODES,
  RESPONSE_MESSAGES,
} from "../../common/common.variable.js";
import { UserPayloadClass } from "../../common/common.classes.js";
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
      return next(
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
      return next(
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

  async signIn(req, res, next) {
    let { username, email, password } = req.body;
    let [error, data] = await tc(this.userRepository.signIn(username, email));

    if (error || !data || data instanceof GenericErrorResponse) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "User not found with the given credentials"
        )
      );
    }

    let [compare_password_error, compare_password] = await tc(
      checkHash(password, data.password)
    );

    if (
      compare_password_error != null ||
      typeof compare_password != "boolean" ||
      compare_password == false
    ) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          RESPONSE_CODES.UNAUTHORIZED,
          ERROR_TYPE.UNAUTHORIZED,
          "Wrong credentials ,try login again"
        )
      );
    }
    let userpayload = UserPayloadClass.createUserPayload(
      data.username,
      data.email,
      data._id
    );
    let token = jwtSign(userpayload);
    data = { accessToken: token };
    res
      .status(RESPONSE_CODES.SUCCESS)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_SIGNIN_SUCCESS,
          OPERATION_STATUS.LOGIN,
          RESPONSE_CODES.SUCCESS,
          data
        )
      );
  }

  // not secure path ended here
}
