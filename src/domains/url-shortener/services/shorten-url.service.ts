import { InvalidUrlError, LackOfUniqueShortenUrlKeyError } from '@/core/errors/errors';
import { ShortenUrl } from '../types';
import crypto, { randomUUID } from 'crypto';
import { findShortenUrlByKey } from '../repositories/shorten-url.repository';
import logger from '@/core/infrastructure/logging/logger';

export const generateShortKey = (length: number = 6): string => {
  return crypto.randomBytes(length).toString('base64url').substring(0, length);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const createShortenUrl = (originalUrl: string): ShortenUrl => {
  if (!validateUrl(originalUrl)) {
    throw new InvalidUrlError(`Invalid URL: ${originalUrl}`);
  }

  const MAX_RETRY_COUNT = 3;
  for (let i = 0; i < MAX_RETRY_COUNT; i++) {
    const shortenUrlKey = generateShortKey();
    const shortenUrl = findShortenUrlByKey(shortenUrlKey);
    if (shortenUrl === null) {
      return {
        id: randomUUID(),
        originalUrl,
        shortenUrlKey,
        redirectCount: 0
      };
    }
  }

  logger.error('Failed to generate unique shorten URL key after 3 attempts', {
    originalUrl,
  });
  throw new LackOfUniqueShortenUrlKeyError('Failed to generate unique shorten URL key after 3 attempts');
};

export const prepareShortenUrlResponse = (shortenUrl: ShortenUrl, baseUrl: string) => {
  return {
    originalUrl: shortenUrl.originalUrl,
    shortenUrl: `${baseUrl}/${shortenUrl.shortenUrlKey}`,
    shortenUrlKey: shortenUrl.shortenUrlKey,
    redirectCount: shortenUrl.redirectCount
  };
};