import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import statusCodes from 'http-status-codes';
import ApiError from './ApiError';
import logger from './logger';

export default (err: any, req: Request, res: Response, _next: NextFunction) => {
  let status = statusCodes.INTERNAL_SERVER_ERROR;
  let msg = '';
  // Api error
  if (err instanceof ApiError) {
    msg = req.__(err.message);
    status = err.status;
    // vaidation errors
  } else if (err instanceof ValidationError) {
    status = err.statusCode;
    let errors: any[] = [];
    if (err.details.body) {
      errors = err.details.body;
    } else if (err.details.params) {
      errors = err.details.params;
    } else if (err.details.query) {
      errors = err.details.query;
    }
    for (const { message } of errors) {
      msg += `${req.__(message)}.`;
    }
    // mongoose errors
  } else if (err.name === 'MongoServerError') {
    // duplicate value
    if (err.code && err.code === 11000) {
      status = statusCodes.CONFLICT;
      const field: string[] = Object.values(err.keyValue);
      msg = req.__('validation.field.duplicate', { field: field[0] });
    }
  } else {
    msg = req.__('errorMsg.serverError');
    if (err.name === 'CastError') {
      msg = err.message;
    }
    if (['JsonWebTokenError', 'TokenExpiredError', 'UnauthorizedError'].includes(err.name)) {
      msg = req.__('user.authorization');
      status = err.status || statusCodes.UNAUTHORIZED;
    }
    // if (err.errors) {
    //   status = statusCodes.BAD_REQUEST;
    //   let errors = Object.values(err.errors).map((el: any) => el.message);
    //   msg += errors.join('.');
    // } else {
    // }
  }
  logger.error(`error[errorHandler]: ${JSON.stringify({ msg, err }, null, 3)}`);
  return res.status(status).json({ msg, err });
};
