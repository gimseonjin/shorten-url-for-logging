import { Router } from 'express';
import { redirectHandler } from '@/domains/url-shortener/handlers/shorten-url.handler';

const router = Router();

/**
 * @swagger
 * /{key}:
 *   get:
 *     summary: Redirect to original URL using shortened key
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The shortened URL key
 *         example: abc123
 *     responses:
 *       302:
 *         description: Redirects to the original URL and increments redirect count
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: The original URL to redirect to
 *       404:
 *         description: Shortened URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Shortened URL not found
 */
router.get('/:key', redirectHandler);

export { router as redirectRoutes };