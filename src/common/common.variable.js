export const RESPONSE_MESSAGES = {
  SUCCESS: "Request processed successfully.",
  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",
  NOT_FOUND: "Resource not found.",
  BAD_REQUEST: "Invalid request parameters.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "Access denied.",
  SERVER_ERROR: "Something went wrong. Please try again later.",

  // User-specific messages

  USER_NOT_CREATED: "User registration was not successful.",
  USER_SIGNUP_SUCCESS: "User registered successfully.",
  USER_SIGNIN_SUCCESS: "User logged in successfully.",
  USER_LOGOUT_SUCCESS: "User logged out successfully.",
  USER_NOT_FOUND: "User does not exist.",
  USERS_NOT_FOUND_BULK : "Users not found in bulk",
  INVALID_CREDENTIALS: "Invalid email or password.",
  LOGGED_IN_USER_NOT_MATCH: "Unmatched url user id and logged in user id.",
  USER_DETAILS_FETCHED : "User fetched successfully", 
  USER_NOT_UPDATED : "User not able to update successfully",
  USER_UPDATED : "User update successfully",

  // Post-specific messages
  POST_CREATED: "Post created successfully.",
  POST_UPDATED: "Post updated successfully.",
  POST_DELETED: "Post deleted successfully.",
  POST_NOT_FOUND: "Post not found.",

  // Comment-specific messages
  COMMENT_ADDED: "Comment added successfully.",
  COMMENT_UPDATED: "Comment updated successfully.",
  COMMENT_DELETED: "Comment deleted successfully.",
  COMMENT_NOT_FOUND: "Comment not found.",

  // Like-specific messages
  LIKE_TOGGLED: "Like status updated.",

  // OTP messages
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  OTP_INVALID: "Invalid OTP.",
  OTP_EXPIRED: "OTP has expired.",

  // Friend Requests
  FRIEND_REQUEST_SENT: "Friend request sent.",
  FRIEND_REQUEST_ACCEPTED: "Friend request accepted.",
  FRIEND_REQUEST_REJECTED: "Friend request rejected.",
  FRIEND_REQUEST_CANCELLED: "Friend request cancelled.",
  FRIEND_REMOVED: "Friend removed.",

  // Multer (File Upload)
  FILE_UPLOAD_SUCCESS: "File uploaded successfully.",
  INVALID_FILE_FORMAT: "Invalid file format. Please upload a valid file.",
  FILE_SIZE_EXCEEDED: "File size exceeds the allowed limit.",
  FILE_UPLOAD_UNSUCCESS : " File upload was not successful"
};

export const RESPONSE_CODES = {
  SUCCESS: 200, // OK
  CREATED: 201, // Resource Created
  ACCEPTED: 202, // Accepted for Processing
  NO_CONTENT: 204, // No Content

  BAD_REQUEST: 400, // Invalid Request
  UNAUTHORIZED: 401, // Unauthorized Access
  FORBIDDEN: 403, // Forbidden
  NOT_FOUND: 404, // Resource Not Found
  CONFLICT: 409, // Conflict in Request
  UNPROCESSABLE: 422, // Validation Errors

  SERVER_ERROR: 500, // Internal Server Error
  SERVICE_UNAVAILABLE: 503, // Service Unavailable
};

export const ERROR_TYPE = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_MISSING: "TOKEN_MISSING",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
};

export const OPERATION_STATUS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LIST: 'LIST',
  LOGIN : 'LOGIN'
};