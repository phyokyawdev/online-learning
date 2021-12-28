logger = require("debug")("server:");

module.exports = (fileName) => {
  return {
    error: (message) => {
      require("debug")(`server:${fileName}`)(message);
    },
    warn: (message) => {
      logger(`warn: ${fileName}: ${message}`);
    },
    info: (message) => {
      require("debug")(`server:${fileName}`)(message);
    },
    verbose: (message) => {
      logger(`verbose: ${fileName}: ${message}`);
    },
    debug: (message) => {
      require("debug")(`server:${fileName}`)(message);
    },
  };
};
