import { ShortenUrl } from '../types';
import { NotFoundShortenUrlError } from '@/core/errors/errors';

const shortenUrls: Map<string, ShortenUrl> = new Map();

export const saveShortenUrl = (shortenUrl: ShortenUrl): void => {
  shortenUrls.set(shortenUrl.shortenUrlKey, shortenUrl);
};

export const findShortenUrlByKey = (shortenUrlKey: string): ShortenUrl => {
  const shortenUrl = shortenUrls.get(shortenUrlKey);
  if (!shortenUrl) {
    throw new NotFoundShortenUrlError(`Shorten URL with key ${shortenUrlKey} not found`);
  }
  return shortenUrl;
};

export const findAllShortenUrls = (): ShortenUrl[] => {
  return Array.from(shortenUrls.values());
};

export const updateRedirectCount = (shortenUrlKey: string): void => {
  const shortenUrl = shortenUrls.get(shortenUrlKey);
  if (shortenUrl) {
    shortenUrl.redirectCount += 1;
    shortenUrls.set(shortenUrlKey, shortenUrl);
  }
};