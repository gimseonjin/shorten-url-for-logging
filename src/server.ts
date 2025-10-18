import 'dotenv/config';
import app from './app';
import logger from '@/core/infrastructure/logging/logger';
import { config } from '@/core/infrastructure/config';

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// SIGTERM: 프로세스 종료 신호
// ex) kill -15 <pid>
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// SIGINT: 사용자가 인터럽트를 요청하는 신호
// ex) Ctrl + C
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});