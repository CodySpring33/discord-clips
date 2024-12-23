import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? new Redis({
  host: process.env.REDIS_HOST || 'redis', // 'redis' is the service name in docker-compose
  port: Number(process.env.REDIS_PORT) || 6379,
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis; 