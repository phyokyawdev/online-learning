const { validationResult } = require("express-validator");
const { ValidationError } = require("@shared/errors");

/**
 * validate Request with provided validation rules
 * @param {Array} validationRules - array of validation rules
 * @returns array of middlewares
 * @throws ValidationError on failed validation
 */
const validateRequest = (validationRules = []) => [
  ...validationRules,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) throw new ValidationError(errors.array());

    next();
  },
];

module.exports = validateRequest;
