import jwt from "jsonwebtoken";
import GenericErrorResponse from "../error.response.handler/custom.application.level.error.js";
import {
  RESPONSE_MESSAGES,
  RESPONSE_CODES,
  ERROR_TYPE,
} from "../common/common.variable.js";
import { tc } from "../common/common.function.js";

/**
 * JWT Authentication Guard Middleware
 *
 * @module Middleware/Auth
 * @description
 * Express middleware that authenticates requests using JSON Web Tokens (JWT).
 * Verifies the JWT from the Authorization header and attaches user data to the request.
 *
 * @function jwtAuthGuard
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @throws {GenericErrorResponse} - Throws custom error responses for:
 *   - Missing/invalid Authorization header (401 Unauthorized)
 *   - Invalid/expired tokens (401 Unauthorized)
 *
 * @property {Object} req.payload - Attaches authenticated user data to the request:
 *   - username: User's username
 *   - email: User's email address
 *   - user_id: User's unique identifier
 *
 * @process
 * 1. Checks for valid "Bearer <token>" Authorization header
 * 2. Extracts and verifies JWT using secret key
 * 3. Handles token expiration and validation errors
 * 4. Attaches decoded user payload to request object
 * 5. Proceeds to next middleware on successful authentication
 *
 * @requires jsonwebtoken - For JWT verification
 * @requires ../error.response.handler/custom.application.level.error.js - Custom error handler
 * @requires ../common/common.variable.js - Application constants
 * @requires ../common/common.function.js - Utility functions (tc for try-catch)
 *
 * @example
 * // In your route definitions:
 * router.get('/protected-route', jwtAuthGuard, (req, res) => {
 *   // Access authenticated user data:
 *   console.log(req.payload.username);
 *   res.send('Protected content');
 * });
 *
 * @note
 * - Ensure JWT_SECRET_KEY environment variable is set
 * - Client must send token in "Authorization: Bearer <token>" header
 * - Always use HTTPS in production to protect tokens
 * - Consider refresh token implementation for better security
 *
 * @see {@link https://jwt.io/introduction/|JWT Introduction}
 * @see {@link https://expressjs.com/en/guide/using-middleware.html|Express Middleware}
 */

export const jwtAuthGuard = async (req, res, next) => {
  // 1. Check Authorization header format
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new GenericErrorResponse(
        RESPONSE_MESSAGES.UNAUTHORIZED,
        RESPONSE_CODES.UNAUTHORIZED,
        ERROR_TYPE.UNAUTHORIZED,
        "Authorization token is required. Please log in."
      )
    );
  }

  const token = authHeader.split(" ")[1];

  const [error, decoded] = await tc(
    jwt.verify(token, process.env.JWT_SECRET_KEY)
  );

  if (error) {
    let message = "Invalid token. Please log in again.";
    let errorType = ERROR_TYPE.UNAUTHORIZED;

    if (error.name === "TokenExpiredError") {
      message = "Session expired. Please log in again.";
      errorType = ERROR_TYPE.TOKEN_EXPIRED;
    }

    return next(
      new GenericErrorResponse(
        RESPONSE_MESSAGES.UNAUTHORIZED,
        RESPONSE_CODES.UNAUTHORIZED,
        errorType,
        message
      )
    );
  }

  if (!req.payload) req.payload = {};
  req.payload.username = decoded.payload.username;
  req.payload.email = decoded.payload.email;
  req.payload.user_id = decoded.payload.user_id;

  next();
};
