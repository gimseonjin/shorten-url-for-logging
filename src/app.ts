import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '@/core/middlewares/error.middleware';
import { shortenUrlRoutes } from '@/routes/shorten-url.routes';
import { redirectRoutes } from '@/routes/redirect.routes';
import { config } from '@/core/infrastructure/config';
import { loggingMiddleware } from './core/middlewares/logging.middleware';
import { swaggerSpec } from '@/core/infrastructure/swagger/swagger.config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Service status endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: URL Shortener Service is running!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-18T12:00:00.000Z
 *                 environment:
 *                   type: string
 *                   example: development
 */
app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener Service is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-18T12:00:00.000Z
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'URL Shortener API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Swagger JSON spec endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', redirectRoutes);
app.use('/', shortenUrlRoutes);

app.use(errorHandler);

export default app;