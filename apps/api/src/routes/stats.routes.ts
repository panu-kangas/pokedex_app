import { Router } from 'express';
import { getTypeCounts, getWeightDistribution } from '../controllers/stats.controller.js';

export const statsRouter = Router();

statsRouter.get('/types-count', getTypeCounts);
statsRouter.get('/weight-dist', getWeightDistribution);
