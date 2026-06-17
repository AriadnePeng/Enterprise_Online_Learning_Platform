import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  host: process.env.API_HOST || '127.0.0.1',
  port: Number(process.env.API_PORT || 8080),
  dataFile: process.env.API_DATA_FILE || path.join(serverDir, 'data', 'database.json'),
  staticDir: process.env.STATIC_DIR || path.join(serverDir, '..', 'dist'),
  tokenSecret: process.env.API_TOKEN_SECRET || 'enterprise-learning-local-secret',
  tokenLifetimeSeconds: Number(process.env.API_TOKEN_LIFETIME || 8 * 60 * 60),
  corsOrigins: new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.API_CORS_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
  ]),
};
