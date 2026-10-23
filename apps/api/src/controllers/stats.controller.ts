import type { RequestHandler } from 'express';
import { countByType, weightDistribution } from '../services/stats.service.js';

export const getTypeCounts: RequestHandler = async (_req, res) => {
  res.json(await countByType());
};

export const getWeightDistribution: RequestHandler = async (_req, res) => {
  res.json(await weightDistribution());
};
