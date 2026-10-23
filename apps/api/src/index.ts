import { config } from './config.js';
import { createApp } from './app.js';
import { connectDb, disconnectDb } from './db.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

try {
  await connectDb(config.mongoUri);
} catch (err) {
  console.error('Could not connect to MongoDB:', err instanceof Error ? err.message : err);
  process.exit(1);
}

const app = createApp({ corsOrigins: config.corsOrigins });

const server = app.listen(config.port, () => {
  console.log(`API listening on port ${config.port} (${config.env})`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);

  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
