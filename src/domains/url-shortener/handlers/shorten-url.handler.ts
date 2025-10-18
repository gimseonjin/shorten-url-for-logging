import { Request, Response, NextFunction } from 'express';
import { createShortenUrl, prepareShortenUrlResponse } from '../services/shorten-url.service';
import { saveShortenUrl, findShortenUrlByKey, findAllShortenUrls, updateRedirectCount } from '../repositories/shorten-url.repository';
import logger from '@/core/infrastructure/logging/logger';
import { NotFoundShortenUrlError } from '@/core/errors/errors';

export const createShortenUrlHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortenUrl = createShortenUrl(originalUrl);
    saveShortenUrl(shortenUrl);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    logger.info('Shorten URL created', shortenUrl);
    const response = prepareShortenUrlResponse(shortenUrl, baseUrl);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const redirectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const shortenUrl = findShortenUrlByKey(key);

    if (shortenUrl === null) {
      throw new NotFoundShortenUrlError(`Shorten URL with key ${key} not found`);
    }

    updateRedirectCount(key);

    res.redirect(shortenUrl.originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getShortenUrlHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const shortenUrl = findShortenUrlByKey(key);

    if (shortenUrl === null) {
      throw new NotFoundShortenUrlError(`Shorten URL with key ${key} not found`);
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = prepareShortenUrlResponse(shortenUrl, baseUrl);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllShortenUrlsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shortenUrls = findAllShortenUrls();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const response = shortenUrls.map(shortenUrl => 
      prepareShortenUrlResponse(shortenUrl, baseUrl)
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};