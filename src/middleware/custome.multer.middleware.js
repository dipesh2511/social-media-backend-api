import { profileUpload, postUpload } from "../config/multer.config.js";
import GenericApplicationResponse from "../error.response.handler/custom.application.level.response.js";
import GenericErrorResponse from "../error.response.handler/custom.application.level.error.js";
import {
  RESPONSE_CODES,
  RESPONSE_MESSAGES,
  ERROR_TYPE,
} from "../common/common.variable.js";

/**
 * Multer Middleware for Profile Picture Upload
 *
 * - Uses `profileUpload.single("profile_picture")` to handle a single file upload.
 * - Validates and processes the uploaded profile picture.
 * - If an error occurs during upload, it passes a `GenericErrorResponse` to the `next` middleware.
 * - If successful, it proceeds to the next middleware.
 *
 * @param {Object} req - Express request object containing the uploaded file.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to continue middleware execution.
 */
export const multerProfilePictureMiddleware = (req, res, next) => {
  profileUpload.single("profile_picture")(req, res, (err) => {
    if (err) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.FILE_UPLOAD_UNSUCCESS,
          RESPONSE_CODES.SERVER_ERROR,
          ERROR_TYPE.SERVER_ERROR,
          "Profile picture upload was not successful due to some issue we will check, try again later"
        )
      );
    }
    next();
  });
};

/**
 * Multer Middleware for Post Picture Upload
 *
 * - Uses `postUpload.array("posts", 10)` to handle multiple file uploads (up to 10).
 * - Processes and validates uploaded post images.
 * - If an error occurs during upload, it triggers a `GenericErrorResponse`.
 * - If successful, it proceeds to the next middleware.
 *
 * @param {Object} req - Express request object containing uploaded files.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to continue middleware execution.
 */
export const multerPostPictureMiddleware = (req, res, next) => {
  postUpload.array("posts", 10)(req, res, (err) => {
    if (err) {
      return next(
        new GenericErrorResponse(
          RESPONSE_MESSAGES.FILE_UPLOAD_UNSUCCESS,
          RESPONSE_CODES.SERVER_ERROR,
          ERROR_TYPE.SERVER_ERROR,
          "Post upload was not successful due to some issue we will check, try again later"
        )
      );
    }
    next();
  });
};
