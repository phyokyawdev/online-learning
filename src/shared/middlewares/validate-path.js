const { NotFoundError } = require("@shared/errors");

/**
 * validate path param with provided callback -
 * throw NotFoundError or pass request to next middleware
 * @param {string} param - path param string
 * @param {function (string): boolean} isValid - callback Function
 * @returns express middleware
 * @throws NotFoundError
 */
const validatePath = (param, isValid) => (req, _res, next) => {
  const pathParam = req.params[param];

  if (!isValid(pathParam))
    throw new NotFoundError(`Invalid path param ${pathParam}`);

  next();
};

module.exports = validatePath;
