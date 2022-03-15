// format: format.combine(format.printf((i) => (i.level === 'info' ? `${i.timestamp} ${i.level}: ${i.message}` : ''))),
import { createLogger, format, transports, addColors } from 'winston';
import { isDevelopment } from '../constants/constants';

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

const level = () => (isDevelopment ? 'debug' : 'warn');

addColors(colors);

const winstonFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const winstonTransports = [
  new transports.Console({ format: format.combine(format.colorize({ all: true })) }),
  new transports.File({
    filename: 'logs/error.log',
    level: 'error',
    handleExceptions: true,
    handleRejections: true,
  }),
  new transports.File({
    filename: 'logs/info.log',
    format: format.combine(
      format.printf((i) => (!['error'].includes(i.level) ? `${i.timestamp} ${i.level}: ${i.message}` : '')),
    ),
  }),
];

export default createLogger({
  levels,
  level: level(),
  format: winstonFormat,
  transports: winstonTransports,
});
