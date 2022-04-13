"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ApiError extends Error {
    constructor(message, status = http_status_codes_1.default.INTERNAL_SERVER_ERROR) {
        super(message);
        this.message = message;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message || 'Something went wrong. Please try again.';
        this.status = status;
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map