import express from 'express';
import { errorHandler } from '@/core/middlewares/error.middleware';
import { shortenUrlRoutes } from '@/routes/shorten-url.routes';
import { redirectRoutes } from '@/routes/redirect.routes';
import { config } from '@/core/infrastructure/config';
import { loggingMiddleware } from './core/middlewares/logging.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

app.get('/', (req, res) => {
  res.json({ 
    message: 'URL Shortener Service is running!',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/', redirectRoutes);
app.use('/', shortenUrlRoutes);

app.use(errorHandler);

export default app;