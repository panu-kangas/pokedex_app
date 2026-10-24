import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { healthRouter } from './routes/health.routes.js';
import { pokemonRouter } from './routes/pokemon.routes.js';
import { statsRouter } from './routes/stats.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export interface AppOptions {
  corsOrigins: string[];
  rateLimitPerMinute?: number;
}

export function createApp({ corsOrigins, rateLimitPerMinute = 100 }: AppOptions) {
  const app = express();

  // Render runs behind a proxy; without this every request shares the proxy's IP in the rate limiter
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));

  // TEMP: inspect Render's proxy chain to pick the right 'trust proxy' value; remove in PR 25
  app.use('/api/health', (req, _res, next) => {
    if ('debug-ip' in req.query) {
      console.log('[debug-ip]', {
        xForwardedFor: req.headers['x-forwarded-for'],
        cfConnectingIp: req.headers['cf-connecting-ip'],
        trueClientIp: req.headers['true-client-ip'],
        socket: req.socket.remoteAddress,
        reqIp: req.ip,
        reqIps: req.ips,
      });
    }
    next();
  });

  app.use('/api/health', healthRouter);

  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      limit: rateLimitPerMinute,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { message: 'Too many requests, please try again later' },
    }),
  );

  app.use('/api', pokemonRouter);
  app.use('/api', statsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
