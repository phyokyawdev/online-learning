const jwt = require("jsonwebtoken");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, "\n");
const jwtPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/gm, "\n");
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const jwtAlgorithm = process.env.JWT_ALGORITHM;
const jwtName = process.env.JWT_NAME;

/**
 * generate auth token from payload
 * @param {*} payload data payload
 * @returns {Promise} auth token
 */
function generateAuthToken(payload) {
  const token = new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtPrivateKey,
      {
        expiresIn: jwtExpiresIn,
        algorithm: jwtAlgorithm,
      },
      (err, token) => {
        if (err) return reject(err);
        else return resolve(token);
      }
    );
  });

  return token;
}

/**
 * set auth token to request
 * @param {Request} req - request
 * @param {*} token - auth token
 */
function setAuthTokenToRequest(req, token) {
  req.session[jwtName] = token;
}

/**
 * get auth token from request
 * @param {Request} req - request
 * @returns auth token
 */
function getAuthTokenFromRequest(req) {
  let token = null;
  if (req && req.session) {
    token = req.session[jwtName];
  }
  return token;
}

/**
 * create and return passport-jwt options
 * @returns passport-jwt strategy options
 */
function getPassportJWTOptions() {
  const options = {
    jwtFromRequest: getAuthTokenFromRequest,
    secretOrKey: jwtPublicKey,
    algorithms: [jwtAlgorithm],
  };
  return options;
}

module.exports = {
  generateAuthToken,
  setAuthTokenToRequest,
  getAuthTokenFromRequest,
  getPassportJWTOptions,
};
