import { InvalidUrlError } from '@/core/errors/errors';
import { ShortenUrl } from '../types';
import crypto from 'crypto';

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

  return {
    originalUrl,
    shortenUrlKey: generateShortKey(),
    redirectCount: 0
  };
};

export const prepareShortenUrlResponse = (shortenUrl: ShortenUrl, baseUrl: string) => {
  return {
    originalUrl: shortenUrl.originalUrl,
    shortenUrl: `${baseUrl}/${shortenUrl.shortenUrlKey}`,
    shortenUrlKey: shortenUrl.shortenUrlKey,
    redirectCount: shortenUrl.redirectCount
  };
};