import { ShortenUrl } from '../types';
import { Database } from '@/core/infrastructure/database/database';
const db = new Database<ShortenUrl, string>();

export const saveShortenUrl = (shortenUrl: ShortenUrl): void => {
  db.save(shortenUrl);
};

export const findShortenUrlByKey = (shortenUrlKey: string): ShortenUrl | null => {
  const shortenUrl = db.findOne({ shortenUrlKey });
  return shortenUrl;
};

export const findByOriginalUrl = (originalUrl: string): ShortenUrl | null => {
  return db.findOne({ originalUrl });
};

export const findByRedirectCount = (redirectCount: number): ShortenUrl[] => {
  return db.findMany({ redirectCount });
};

export const findByMultipleCriteria = (criteria: Partial<ShortenUrl>): ShortenUrl[] => {
  return db.findMany(criteria);
};

export const findAllShortenUrls = (): ShortenUrl[] => {
  return db.findAll();
};

export const updateRedirectCount = (shortenUrlKey: string): void => {
  const shortenUrl = db.findOne({ shortenUrlKey });
  if (shortenUrl) {
    const updated = { ...shortenUrl, redirectCount: shortenUrl.redirectCount + 1 };
    db.save(updated);
  }
};