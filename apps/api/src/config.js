import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Load the repo-root .env if present (mock mode needs nothing from it).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  dataMode: process.env.DATA_MODE || 'mock', // 'mock' | 'live'
  port: Number(process.env.API_PORT || 4000),
  host: process.env.API_HOST || '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',

  postgresUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || '',
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || '',

  openaiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_SUMMARY_MODEL || 'gpt-4o',
};

export const isMock = config.dataMode !== 'live';
