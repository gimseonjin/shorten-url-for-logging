import { Request, Response, NextFunction } from 'express';
import { NotFoundShortenUrlError, InvalidUrlError } from '@/core/errors/errors';

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

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
};