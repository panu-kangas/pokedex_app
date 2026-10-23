import { Router } from 'express';
import { isDbConnected } from '../db.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const dbUp = isDbConnected();
  res.status(dbUp ? 200 : 503).json({ status: dbUp ? 'ok' : 'degraded', db: dbUp ? 'up' : 'down' });
});
