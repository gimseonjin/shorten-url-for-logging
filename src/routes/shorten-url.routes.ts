import { Router } from 'express';
import { 
  createShortenUrlHandler, 
  getShortenUrlHandler, 
  getAllShortenUrlsHandler 
} from '@/domains/url-shortener/handlers/shorten-url.handler';

const router = Router();

router.post('/api/shorten', createShortenUrlHandler);
router.get('/api/shorten/:key', getShortenUrlHandler);
router.get('/api/shorten', getAllShortenUrlsHandler);

export { router as shortenUrlRoutes };