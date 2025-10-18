import { Request, Response, NextFunction } from 'express';
import { NotFoundShortenUrlError, InvalidUrlError, LackOfUniqueShortenUrlKeyError } from '@/core/errors/errors';
import logger from '@/core/infrastructure/logging/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NotFoundShortenUrlError) {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message
    });
  }

  if (error instanceof InvalidUrlError) {
    return res.status(400).json({
      error: 'Bad Request',
      message: error.message
    });
  }

  if (error instanceof LackOfUniqueShortenUrlKeyError) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }

  // Log only unexpected errors (500 errors)
  logger.error('Unexpected error occurred', {
    error: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
};