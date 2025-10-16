import { Router } from 'express';
import { redirectHandler } from '@/domains/url-shortener/handlers/shorten-url.handler';

const router = Router();

router.get('/:key', redirectHandler);

export { router as redirectRoutes };