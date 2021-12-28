const isProduction = process.env.NODE_ENV === "production";

let logger;

if (isProduction) {
  logger = require("./production");
} else {
  logger = require("./development");
}

module.exports = logger;
