import statusCodes from 'http-status-codes';

class ApiError extends Error {
  constructor(public message: string, public status: number = statusCodes.INTERNAL_SERVER_ERROR) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.status = status;
  }
}

export default ApiError;
