import 'dotenv/config';
import { z } from 'zod';
import { parseCorsOrigins } from './utils/cors-origins.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1),
  CORS_ORIGIN: z
    .string()
    .default('https://pokedex-app-seven-tan.vercel.app')
    .transform(parseCorsOrigins),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

export const config = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGO_URI,
  corsOrigins: parsed.data.CORS_ORIGIN,
};
