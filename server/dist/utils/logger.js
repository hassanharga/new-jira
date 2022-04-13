"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const constants_1 = require("../constants/constants");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
const level = () => (constants_1.isDevelopment ? 'debug' : 'warn');
(0, winston_1.addColors)(colors);
const winstonFormat = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.align(), winston_1.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const winstonTransports = [
    new winston_1.transports.Console({ format: winston_1.format.combine(winston_1.format.colorize({ all: true })) }),
    new winston_1.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        handleExceptions: true,
        handleRejections: true,
    }),
    new winston_1.transports.File({
        filename: 'logs/info.log',
        format: winston_1.format.combine(winston_1.format.printf((i) => (!['error'].includes(i.level) ? `${i.timestamp} ${i.level}: ${i.message}` : ''))),
    }),
];
exports.default = (0, winston_1.createLogger)({
    levels,
    level: level(),
    format: winstonFormat,
    transports: winstonTransports,
});
//# sourceMappingURL=logger.js.map