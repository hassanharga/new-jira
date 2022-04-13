"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("../constants/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const stream = {
    write: (message) => logger_1.default.http(message),
};
const skip = () => !constants_1.isDevelopment;
const morganMiddleware = (0, morgan_1.default)(':remote-addr :method :url :status :res[content-length] - :response-time ms', { stream, skip });
exports.default = morganMiddleware;
//# sourceMappingURL=httpLogger.js.map