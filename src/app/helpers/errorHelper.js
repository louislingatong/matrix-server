class Error {
  constructor(status, message, error) {
    this.status = status;
    this.message = message;
    this.error = error;
  }

  static badRequest(msg) {
    throw new Error(400, msg);
  }

  static unprocessableEntity(error) {
    throw new Error(422, 'Unprocessable Entity', error);
  }
}

module.exports = Error;