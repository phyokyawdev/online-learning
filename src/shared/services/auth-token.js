const jwtName = process.env.JWT_NAME;

/**
 * set auth token for request
 * @param {Request} req - request
 * @param {*} token - auth token
 */
function setAuthTokenForRequest(req, token) {
  req.session[jwtName] = token;
}

module.exports = { setAuthTokenForRequest };
