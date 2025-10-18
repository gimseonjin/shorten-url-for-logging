import { Router } from 'express';
import {
  createShortenUrlHandler,
  getShortenUrlHandler,
  getAllShortenUrlsHandler
} from '@/domains/url-shortener/handlers/shorten-url.handler';

const router = Router();

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a new shortened URL
 *     tags: [URL Shortener]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *                 description: The original URL to shorten
 *                 example: https://example.com/very/long/url/path
 *     responses:
 *       201:
 *         description: Shortened URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                   example: https://example.com/very/long/url/path
 *                 shortenUrl:
 *                   type: string
 *                   example: http://localhost:3000/abc123
 *                 shortenUrlKey:
 *                   type: string
 *                   example: abc123
 *                 redirectCount:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Invalid URL format or missing originalUrl parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid URL format
 */
router.post('/api/shorten', createShortenUrlHandler);

/**
 * @swagger
 * /api/shorten/{key}:
 *   get:
 *     summary: Get details of a specific shortened URL
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
 *       200:
 *         description: Shortened URL details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                   example: https://example.com/very/long/url/path
 *                 shortenUrl:
 *                   type: string
 *                   example: http://localhost:3000/abc123
 *                 shortenUrlKey:
 *                   type: string
 *                   example: abc123
 *                 redirectCount:
 *                   type: integer
 *                   example: 3
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
router.get('/api/shorten/:key', getShortenUrlHandler);

/**
 * @swagger
 * /api/shorten:
 *   get:
 *     summary: Get all shortened URLs
 *     tags: [URL Shortener]
 *     responses:
 *       200:
 *         description: List of all shortened URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   originalUrl:
 *                     type: string
 *                     example: https://example.com/url1
 *                   shortenUrl:
 *                     type: string
 *                     example: http://localhost:3000/xyz789
 *                   shortenUrlKey:
 *                     type: string
 *                     example: xyz789
 *                   redirectCount:
 *                     type: integer
 *                     example: 5
 */
router.get('/api/shorten', getAllShortenUrlsHandler);

export { router as shortenUrlRoutes };