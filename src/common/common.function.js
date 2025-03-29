import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * A utility function to handle promises with try-catch blocks in a cleaner way.
 * Wraps a promise and returns an array with either [error, null] or [null, data].
 *
 * @param {Promise} Promise - The promise to be executed and handled
 * @param {Object} [errorExt={}] - Additional properties to attach to the error object if the promise rejects
 *
 * @returns {Array} - Returns an array where:
 *   - First element is the error (null if promise resolved successfully)
 *   - Second element is the resolved data (null if promise rejected)
 *
 * @example
 * // Basic usage
 * const [err, data] = await tc(someAsyncFunction());
 * if (err) {
 *   // handle error
 * }
 * // use data
 *
 * @example
 * // With additional error context
 * const [err, data] = await tc(someAsyncFunction(), { context: 'additional info' });
 * if (err) {
 *   console.log(err.context); // 'additional info'
 * }
 *
 * @note This pattern is inspired by Go's error handling style where errors are
 * returned rather than thrown, making error handling more explicit.
 */
export const tc = async (Promise, errorExt = {}) => {
  try {
    const data = await Promise;
    return [null, data];
  } catch (error) {
    Object.assign(error, errorExt);
    return [error, null];
  }
};

/**
 * Generates a salted hash for a given password using bcrypt.
 * This function is used during user registration or password updates to securely store passwords.
 *
 * @param {string} password - The plain text password to be hashed
 * @returns {Promise<string>} - Returns a promise that resolves to the hashed password
 *
 * @example
 * // Usage during user registration
 * const hashedPassword = await applySalting('userPassword123');
 * // Store hashedPassword in database
 *
 * @note
 * - Uses bcrypt's genSalt with a cost factor of 12 (recommended for good security)
 * - The salt is automatically included in the resulting hash string
 * - Always use this instead of storing plain text passwords
 */
export const applySalting = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const new_password = await bcrypt.hash(password, salt);
  return new_password;
};

/**
 * Compares a plain text password with a hashed password to verify if they match.
 * This function is used during login to validate user credentials.
 *
 * @param {string} password - The plain text password to verify
 * @param {string} hash_password - The hashed password stored in database
 * @returns {Promise<boolean>} - Returns a promise that resolves to:
 *   - true if passwords match
 *   - false if passwords don't match
 *
 * @example
 * // Usage during login
 * const isValid = await checkHash('inputPassword', storedHashedPassword);
 * if (isValid) {
 *   // Grant access
 * } else {
 *   // Deny access
 * }
 *
 * @note
 * - Uses bcrypt's compare function which handles the salt extraction automatically
 * - Timing-safe comparison is performed to prevent timing attacks
 * - Never compare hashes directly (always use this function)
 */
export const checkHash = async (password, hash_password) => {
  const check_password = await bcrypt.compare(password, hash_password);
  return check_password;
};


/**
 * Generates a JSON Web Token (JWT) with the provided payload.
 * This function is used to create authentication tokens for users.
 *
 * @param {Object} payload - The user data to be encoded in the token
 * @param {string} payload.username - The user's unique username
 * @param {string} payload.email - The user's email address
 * @param {ObjectId} payload.user_id - The MongoDB ObjectId of the user
 * @returns {string} - Returns the generated JWT token string
 *
 * @example
 * // Usage when creating auth token
 * const token = jwtSign({
 *   username: 'johndoe123',
 *   email: 'john.doe@example.com',
 *   user_id: new ObjectId('67e7186b3617ffe6d8da1cc2')
 * });
 * // Send this token to client for authentication
 *
 * @note
 * - Uses the jsonwebtoken library for signing
 * - Token expires in 1 year (consider shorter expiry for production)
 * - Secret key is read from environment variables (JWT_SECRET_KEY)
 * - Payload is nested under a 'payload' property for additional security
 * - Never expose the secret key in client-side code
 */
export const jwtSign = (payload) => {
  let token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1year",
  });
  return token;
};
