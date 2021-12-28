const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");
const { Loggly } = require("winston-loggly-bulk");
const { combine, errors, timestamp, ms, json } = winston.format;

const logDir = path.join(__dirname, "../../../logs/");
const level = process.env.LOG_LEVEL || "info";
const logglyToken = process.env.LOGGLY_TOKEN;
const logglySubdomain = process.env.LOGGLY_SUBDOMAIN;

const loggly = new Loggly({
  token: logglyToken,
  subdomain: logglySubdomain,
  tags: ["Winston-NodeJS"],
  json: true,
});

const dailyFile = new winston.transports.DailyRotateFile({
  filename: "oxygen-%DATE%.log",
  zippedArchive: true,
  dirname: logDir,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level,
  format: combine(timestamp(), errors({ stack: true }), ms(), json()),
  transports: [loggly, dailyFile],
});

module.exports = function generateLogger(name) {
  return {
    error: (message) => {
      logger.error(message, { label: name });
    },
    warn: (message) => {
      logger.warn(message, { label: name });
    },
    info: (message) => {
      logger.info(message, { label: name });
    },
    verbose: (message) => {
      logger.verbose(message, { label: name });
    },
    debug: (message) => {
      logger.debug(message, { label: name });
    },
  };
};
