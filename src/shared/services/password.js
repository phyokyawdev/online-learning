const { scrypt, randomBytes } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

/**
 * Hash password
 * @param {string} password - Password to be hashed.
 * @returns {Promise<string>} - Hashed password.
 */
async function hashPassword(password) {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, 64);

  const hashedPassword = `${buf.toString("hex")}l${salt}`;

  return hashedPassword;
}

/**
 * Compare passwords
 * @param {string} storedPassword - Password stored in db.
 * @param {string} suppliedPassword - Password supplied by user.
 * @returns {Promise<boolean>} - Boolean
 */
async function checkPasswords(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split("l");
  const buf = await scryptAsync(suppliedPassword, salt, 64);

  const isEqual = buf.toString("hex") === hashedPassword;

  return isEqual;
}

module.exports = { hashPassword, checkPasswords };
