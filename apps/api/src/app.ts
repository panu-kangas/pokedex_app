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

  // Render's chain is client → Cloudflare → Render load balancer, which arrives as
  // "X-Forwarded-For: <client>, <cloudflare>" from the load balancer's socket. Trusting exactly
  // these two hops makes req.ip the client; anything further left is client-supplied.
  app.set('trust proxy', 2);

  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));

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
