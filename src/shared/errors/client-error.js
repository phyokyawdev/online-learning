class ClientError extends Error {
  constructor(statusCode, message) {
    if (statusCode < 400 || statusCode > 499) {
      throw new TypeError("ClientError statusCode must be 4xx");
    }
    super(message);
    this.name = "ClientError";
    this.statusCode = statusCode;
  }

  serialize() {
    return [{ message: this.message }];
  }
}

module.exports = ClientError;
