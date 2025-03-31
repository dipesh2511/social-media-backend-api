import mongoose from "mongoose";
import path from "path";
import fs from "fs";
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
  //utility function for user started here
  // async deleteExistingProfilePicture(user_id) {
  //   let [error, data] = await tc(
  //     this.userModel.findOne({ _id: new ObjectId(user_id) })
  //   );

  //   if (error || !data) {
  //     return new GenericErrorResponse(
  //       RESPONSE_MESSAGES.USER_NOT_UPDATED,
  //       RESPONSE_CODES.SERVER_ERROR,
  //       ERROR_TYPE.INTERNAL_ERROR,
  //       "User not found while updating the profile picture, try again later"
  //     );
  //   }
  //   if (data.profilePicture) {
  //     let picture_name = data.profilePicture.split("/")[1];
  //     console.log(picture_name)
  //     const filePath = path.join(
  //       path.resolve("pictures", "profile.pictures", picture_name)
  //     );
  //     console.log(filePath)

  //     try {
  //       fs.unlinkSync(filePath)
  //     } catch (error) {
  //       console.log(error)
  //      return false
  //     }
  //   }

  //   [error, data] = await tc(
  //     this.userModel.updateOne(
  //       { _id: new ObjectId(user_id) },
  //       { profilePicture: "null" }
  //     )
  //   );

  //   if (error || !data) {
  //     return new GenericErrorResponse(
  //       RESPONSE_MESSAGES.USER_NOT_UPDATED,
  //       RESPONSE_CODES.SERVER_ERROR,
  //       ERROR_TYPE.INTERNAL_ERROR,
  //       "while updating the profile picture error occur, try again later"
  //     );
  //   }

  //   return true;
  // }

  async addTokenToDataBase(token, user_id) {
    let [error, data] = await tc(
      this.userModel.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $push: {
            validAccessTokens: {
              token: token,
              createdAt: new Date(),
            },
          },
        }
      )
    );

    if (error || !data) {
      new GenericErrorResponse(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        RESPONSE_CODES.INTERNAL_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "Enable to set token in data base ,try login again"
      );
    }

    [error, data] = await tc(
      this.userModel.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $pull: {
            validAccessTokens: {
              createdAt: {
                $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        }
      )
    );

    if (error || !data) {
      new GenericErrorResponse(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        RESPONSE_CODES.INTERNAL_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "Enable to set token in data base ,try login again"
      );
    }
    return data;
  }

  async verifyValidToken(token, user_id) {
    let [error, data] = await tc(
      this.userModel
        .findOne({ _id: new ObjectId(user_id) })
        .select({ validAccessTokens: 1, invalidAccessTokens: 1 })
    );

    if (error || !data) {
      return GenericErrorResponse(
        RESPONSE_MESSAGES.BAD_REQUEST,
        RESPONSE_CODES.BAD_REQUEST,
        ERROR_TYPE.BAD_REQUEST,
        error?.message || "No such user is present in the data base"
      );
    }

    if (data.validAccessTokens.length < 1) {
      return false;
    }

    if (data.invalidAccessTokens.includes(token)) {
      return false;
    }

    return true;
  }

  // utility function for users ended here

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
        error?.message || "User not found with the given credentials"
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

  async updateDetails(updateUserFilter, user_id) {
    let [error, data] = await tc(
      this.userModel.updateOne({ _id: new ObjectId(user_id) }, updateUserFilter)
    );
    if (error || !data) {
      return new GenericErrorResponse(
        RESPONSE_MESSAGES.USER_NOT_CREATED,
        RESPONSE_CODES.SERVER_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "User not Update due to some issue , try again later"
      );
    }
    return data;
  }

  async logout(token, user_id) {
    let [error, data] = await tc(
      this.userModel.updateOne(
        { _id: new ObjectId(user_id) },
        { $push: { invalidAccessTokens: token } }
      )
    );

    if (error || !data) {
      new GenericErrorResponse(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        RESPONSE_CODES.INTERNAL_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "Enable to Log out from system ,try login again"
      );
    }
    return data;
  }

  async logoutAllDevices(user_id) {
    let [error, data] = await tc(
      this.userModel
        .findOne({ _id: new ObjectId(user_id) })
        .select({ validAccessTokens: 1, invalidAccessTokens: 1 })
    );

    if (error || !data) {
      new GenericErrorResponse(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        RESPONSE_CODES.INTERNAL_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "Enable to Log out from all system ,try login again"
      );
    }

    // saving all the valid token in a array
    // empty the validAccessTokens
    // adding the valid token array into the invalidAccessTokens
    let validTokens = [];
    data.validAccessTokens.forEach((tokenObj) => {
      validTokens.push(tokenObj.token);
    });

    data.validAccessTokens = [];

    data.invalidAccessTokens = [...data.invalidAccessTokens, ...validTokens];
    [error,data] = await tc(data.save())
    if (error || !data) {
      new GenericErrorResponse(
        RESPONSE_MESSAGES.INTERNAL_ERROR,
        RESPONSE_CODES.INTERNAL_ERROR,
        ERROR_TYPE.INTERNAL_ERROR,
        error?.message || "Enable to Log out from all system ,try login again"
      );
    }
    return data;
  }

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
        error?.message ||
          "User not created due to some error we'll check and let you know"
      );
    }
    let userData = data.toObject();
    delete userData.password;
    delete userData.invalidAccessTokens;
    delete userData.validAccessTokens;
    delete userData.createdAt;
    delete userData.updatedAt;

    return userData;
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
        error?.message || "User not found with the given credentials"
      );
    }
    return data;
  }

  // not secure path ended here
}
