import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import MDC from '@/core/infrastructure/logging/mdc';
import logger from '@/core/infrastructure/logging/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || randomUUID();
  const start = Date.now();

  // Set up MDC context for this request
  const context = {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  // Run the rest of the request handling within MDC context
  MDC.run(context, () => {
    // Log incoming request (info level - basic info only)
    logger.info('Incoming request');

    // Log detailed request info (debug level - includes query and body)
    logger.debug('Request details', {
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

      // Log response
      logger.log(logLevel, 'Request completed', {
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    });

    next();
  });
};