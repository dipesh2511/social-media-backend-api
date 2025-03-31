import jwt from "jsonwebtoken";
import GenericErrorResponse from "../error.response.handler/custom.application.level.error.js";
import {
  RESPONSE_MESSAGES,
  RESPONSE_CODES,
  ERROR_TYPE,
} from "../common/common.variable.js";
import { tc } from "../common/common.function.js";
import UserRepository from "../features/users/user.repository.js";

let userRepository = new UserRepository();

/**
 * Middleware for JWT authentication and authorization guard.
 * Verifies access tokens and attaches user payload to the request if valid.
 *
 * @param {Object} req - Express request object containing headers
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {void|GenericErrorResponse} - Either proceeds to next middleware or returns:
 *   - 401 Unauthorized for missing/invalid tokens
 *   - Custom expired token messages
 *   - Rejection when token not in validAccessTokens
 *
 * @example
 * // Basic usage in route
 * router.get('/protected', jwtAuthGuard, (req, res) => {
 *   // Only accessible with valid token
 *   res.json(req.payload); 
 * });
 *
 * @example
 * // Error handling
 * app.use((err, req, res, next) => {
 *   if (err instanceof GenericErrorResponse) {
 *     return res.status(err.statusCode).json(err);
 *   }
 * });
 *
 * @note This implements a robust authentication flow that:
 *   - Validates Authorization header format
 *   - Verifies JWT signature and expiration
 *   - Checks token against database records
 *   - Attaches user data to req.payload
 *   - Handles all error cases with specific messages
 *
 * @security
 * - Uses Bearer token authentication scheme (RFC 6750)
 * - Validates tokens against stored validAccessTokens
 * - Protects against token replay attacks
 * - Implements proper error handling to avoid information leakage
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

  let [checkTokenError, data] = await tc(
    userRepository.verifyValidToken(token, decoded.payload.user_id)
  );
  if (
    checkTokenError ||
    !data ||
    data instanceof GenericErrorResponse ||
    typeof data != "boolean" ||
    data == false
  ) {
    return next(
      new GenericErrorResponse(
        RESPONSE_MESSAGES.UNAUTHORIZED,
        RESPONSE_CODES.UNAUTHORIZED,
        ERROR_TYPE.TOKEN_EXPIRED,
        "Please login again"
      )
    );
  }

  if (!req.payload) req.payload = {};
  req.payload.username = decoded.payload.username;
  req.payload.email = decoded.payload.email;
  req.payload.user_id = decoded.payload.user_id;

  next();
};
