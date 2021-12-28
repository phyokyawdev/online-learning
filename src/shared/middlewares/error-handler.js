const logger = require("@shared/logger")("error-handler");
const { ClientError } = require("@shared/errors");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ClientError) {
    return res.status(err.statusCode).send({
      errors: err.serialize(),
    });
  }

  logger.error(err);
  res.status(500).send({
    errors: [{ message: "Something went wrong!" }],
  });
}

module.exports = errorHandler;
