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

  async getDetails(req, res, next) {
    let loggedInUserId = req.params.userId;

    if (loggedInUserId != req.payload.user_id) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.LOGGED_IN_USER_NOT_MATCH,
          RESPONSE_CODES.CONFLICT,
          ERROR_TYPE.BAD_REQUEST,
          "Provided user id is not a valid user id for logged in user check it and retry again"
        )
      );
    }

    let [error, data] = await tc(
      this.userRepository.getDetails(loggedInUserId)
    );

    if (error || !data || data instanceof GenericErrorResponse) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "User not found with the given user id"
        )
      );
    }
    res
      .status(RESPONSE_CODES.SUCCESS)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_DETAILS_FETCHED,
          OPERATION_STATUS.READ,
          RESPONSE_CODES.SUCCESS,
          data
        )
      );
  }

  async getAllDetails(req, res, next) {
    let loggedInUserId = req.payload.user_id;

    let [error, data] = await tc(
      this.userRepository.getAllDetails(loggedInUserId)
    );

    if (error || !data || data instanceof GenericErrorResponse) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "User not found with the given user id"
        )
      );
    }
    res
      .status(RESPONSE_CODES.SUCCESS)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_DETAILS_FETCHED,
          OPERATION_STATUS.READ,
          RESPONSE_CODES.SUCCESS,
          data
        )
      );
  }

  async updateDetails(req, res, next) {
    let updateUserFilter = {};
    let loggedInUserId = req.params.userId;

    if (loggedInUserId != req.payload.user_id) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.LOGGED_IN_USER_NOT_MATCH,
          RESPONSE_CODES.CONFLICT,
          ERROR_TYPE.BAD_REQUEST,
          "Provided user id is not a valid user id for logged in user check it and retry again"
        )
      );
    }

    let {
      username,
      email,
      password,
      firstName,
      lastName,
      profilePicture,
      bio,
    } = req.body;

    if (username != null && email != null) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.BAD_REQUEST,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "User name and email can't be updated"
        )
      );
    }
    if (profilePicture) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.BAD_REQUEST,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "Profile picture can't be string"
        )
      );
    }

    if (password) {
      password = await applySalting(password);
      updateUserFilter.password = password;
    }

    if (firstName) {
      updateUserFilter.firstName = firstName;
    }

    if (lastName) {
      updateUserFilter.lastName = lastName;
    }

    if (req.file) {
      updateUserFilter.profilePicture = `/${req.file.filename}`;
      // let [error, data] = await tc(
      //   this.userRepository.deleteExistingProfilePicture(req.payload.user_id)
      // );
      // if (error || !data) {
      //   console.log(error)
      //   return next(
      //     new GenericErrorResponse(
      //       RESPONSE_MESSAGES.BAD_REQUEST,
      //       RESPONSE_CODES.BAD_REQUEST,
      //       ERROR_TYPE.BAD_REQUEST,
      //       error
      //     )
      //   );
      // }
    }

    if (bio) {
      updateUserFilter.bio = bio;
    }

    let [error, data] = await tc(
      this.userRepository.updateDetails(updateUserFilter, req.payload.user_id)
    );

    if (error || !data || data instanceof GenericErrorResponse) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.USER_NOT_UPDATED,
          RESPONSE_CODES.SERVER_ERROR,
          ERROR_TYPE.SERVER_ERROR,
          "User not updated successfully due to some reason"
        )
      );
    }

    if (updateUserFilter.password) {
      delete updateUserFilter.password;
    }

    res
      .status(RESPONSE_CODES.SUCCESS)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_UPDATED,
          OPERATION_STATUS.UPDATE,
          RESPONSE_CODES.SUCCESS,
          updateUserFilter
        )
      );
  }

  async logout(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    let user_id = req.payload.user_id;

    let [error, data] = await tc(this.userRepository.logout(token, user_id));

    if (error || !data || data instanceof GenericErrorResponse) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.SERVER_ERROR,
          RESPONSE_CODES.SERVER_ERROR,
          ERROR_TYPE.SERVER_ERROR,
          "User not able to logout successfully, try again later"
        )
      );
    }

    res
      .status(RESPONSE_CODES.SUCCESS)
      .send(
        new GenericApplicationResponse(
          RESPONSE_MESSAGES.USER_LOGOUT_SUCCESS,
          OPERATION_STATUS.LOGOUT,
          RESPONSE_CODES.SUCCESS,
          data
        )
      );
  }

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

    if (profilePicture) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.BAD_REQUEST,
          RESPONSE_CODES.BAD_REQUEST,
          ERROR_TYPE.BAD_REQUEST,
          "Profile picture can't be string"
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

    let [tokenError, tokenData] = await tc(
      this.userRepository.addTokenToDataBase(token, data._id)
    );

    if (tokenError || !tokenData) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.INTERNAL_ERROR,
          RESPONSE_CODES.INTERNAL_ERROR,
          ERROR_TYPE.INTERNAL_ERROR,
          "Enable to generate token ,try login again"
        )
      );
    }

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
