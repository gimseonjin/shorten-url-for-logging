import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import MDC from './mdc';

// Custom format to include MDC context
const mdcFormat = winston.format((info) => {
  const mdcContext = MDC.getContext();
  return { ...info, ...mdcContext };
});

// Load configuration from environment variables
const LOG_DIR = process.env.LOG_DIR || 'logs';
const LOG_MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';
const LOG_ERROR_MAX_FILES = process.env.LOG_ERROR_MAX_FILES || '14d';
const LOG_DEBUG_MAX_FILES = process.env.LOG_DEBUG_MAX_FILES || '3d';
const LOG_COMBINED_MAX_FILES = process.env.LOG_COMBINED_MAX_FILES || '14d';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    mdcFormat(), // Include MDC context
    winston.format.json()
  ),
  transports: [
    // Error logs - configurable retention
    new DailyRotateFile({
      filename: `${LOG_DIR}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_ERROR_MAX_FILES,
    }),
    // Debug logs - configurable retention (for detailed debugging)
    new DailyRotateFile({
      filename: `${LOG_DIR}/debug-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'debug',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_DEBUG_MAX_FILES,
    }),
    // Info and above logs - configurable retention
    new DailyRotateFile({
      filename: `${LOG_DIR}/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_COMBINED_MAX_FILES,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      mdcFormat(), // Include MDC context in console too
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, requestId, method, url, ...rest }) => {
        const mdcInfo = requestId ? `[${requestId}] ${method} ${url}` : '';
        const restStr = Object.keys(rest).length > 0 ? JSON.stringify(rest) : '';
        return `${timestamp} ${level}: ${mdcInfo} ${message} ${restStr}`;
      })
    )
  }));
}

export default logger;