import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { UserSchema } from "./user.schema.js";
import { tc } from "../../common/common.function.js";
import {
  ERROR_TYPE,
  RESPONSE_MESSAGES,
  RESPONSE_CODES,
} from "../../common/common.variable.js";
import GenericErrorResponse from "../../error.response.handler/custom.application.level.error.js";

export default class UserRepository {
  constructor() {
    this.userModel = mongoose.model("users", UserSchema);
  }

  // secure paths started here
  async getDetails(user_id) {
    let [error, data] = await tc(
      this.userModel.findOne({ _id: new ObjectId(user_id) })
    );

    if (error || !data) {
      return new GenericErrorResponse(
        RESPONSE_MESSAGES.USER_NOT_FOUND,
        RESPONSE_CODES.BAD_REQUEST,
        ERROR_TYPE.BAD_REQUEST,
        "User not found with the given credentials"
      );
    }
    return data;
  }

  async getAllDetails(user_id) {
    let [error, data] = await tc(
      this.userModel.find(
        { _id: { $ne: new ObjectId(user_id) } },
        { password: 0 }
      )
    );

    if (error || !data) {
      return new GenericErrorResponse(
        RESPONSE_MESSAGES.USERS_NOT_FOUND_BULK,
        RESPONSE_CODES.NOT_FOUND,
        ERROR_TYPE.INTERNAL_ERROR,
        "Bulk Users not fetched"
      );
    }
    return data;
  }

  async updateDetails() {}

  async logout() {}

  async logoutAllDevices() {}

  // secure paths ended here

  // not secure path started here

  async signUp(user) {
    let new_user = new this.userModel(user);
    let [error, data] = await tc(new_user.save());
    if (error || !data) {
      return new GenericErrorResponse(
        RESPONSE_MESSAGES.USER_NOT_CREATED,
        RESPONSE_CODES.SERVER_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        "User not created due to some error we'll check and let you know"
      );
    }
    return data;
  }

  async signIn(username, email) {
    let [error, data] = await tc(
      this.userModel.findOne({ username, email }).select("+password")
    );

    if (error || !data) {
      return new GenericErrorResponse(
        RESPONSE_MESSAGES.USER_NOT_FOUND,
        RESPONSE_CODES.BAD_REQUEST,
        ERROR_TYPE.BAD_REQUEST,
        "User not found with the given credentials"
      );
    }
    return data;
  }

  // not secure path ended here
}
