const ClientError = require("./client-error");

class ConflictError extends ClientError {
  constructor(message = "Conflict") {
    super(409, message);
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
