import { isMock, config } from '../config.js';

// Cache abstraction. Mock mode = in-memory Map with TTL. Live mode = Redis.
// Used for trending articles, feed caching, and session data.

class MemoryCache {
  constructor() {
    this.map = new Map();
  }
  async get(key) {
    const hit = this.map.get(key);
    if (!hit) return null;
    if (hit.expiresAt && hit.expiresAt < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return hit.value;
  }
  async set(key, value, ttlSeconds = 0) {
    this.map.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0,
    });
  }
  async del(key) {
    this.map.delete(key);
  }
}

// A thin place to swap in `ioredis` for DATA_MODE=live:
//   import Redis from 'ioredis';
//   const client = new Redis(config.redisUrl);
//   get -> JSON.parse(await client.get(key)), set -> client.set(key, JSON.stringify(v), 'EX', ttl)
export const cache = new MemoryCache();

export const cacheBackend = isMock ? 'memory' : `redis(${config.redisUrl || 'unconfigured'})`;
