import winston from 'winston';
import MDC from './mdc';

// Custom format to include MDC context
const mdcFormat = winston.format((info) => {
  const mdcContext = MDC.getContext();
  return { ...info, ...mdcContext };
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    mdcFormat(), // Include MDC context
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
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