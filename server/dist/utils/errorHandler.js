"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("../constants/constants");
const ApiError_1 = __importDefault(require("./ApiError"));
const logger_1 = __importDefault(require("./logger"));
exports.default = (err, req, res, _next) => {
    let status = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let msg = '';
    if (err instanceof ApiError_1.default) {
        msg = req.__(err.message);
        status = err.status;
    }
    else if (err instanceof express_validation_1.ValidationError) {
        status = err.statusCode;
        let errors = [];
        if (err.details.body) {
            errors = err.details.body;
        }
        else if (err.details.params) {
            errors = err.details.params;
        }
        else if (err.details.query) {
            errors = err.details.query;
        }
        for (const { message } of errors) {
            msg += `${req.__(message)}.`;
        }
    }
    else if (err.name === 'MongoServerError') {
        if (err.code && err.code === 11000) {
            status = http_status_codes_1.default.CONFLICT;
            const field = Object.values(err.keyValue);
            msg = req.__('validation.field.duplicate', { field: field[0] });
        }
    }
    else {
        msg = req.__('errorMsg.serverError');
        if (err.name === 'CastError') {
            msg = err.message;
        }
        if (['JsonWebTokenError', 'TokenExpiredError', 'UnauthorizedError'].includes(err.name)) {
            msg = req.__('user.authorization');
            status = err.status || http_status_codes_1.default.UNAUTHORIZED;
        }
    }
    if (constants_1.isDevelopment) {
        console.log('error[errorHandler]', err);
    }
    else {
        logger_1.default.error(`error[errorHandler]: ${JSON.stringify({ msg, err }, null, 3)}`);
    }
    return res.status(status).json({ msg, err });
};
//# sourceMappingURL=errorHandler.js.map