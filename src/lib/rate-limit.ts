import { kv } from '@vercel/kv';

interface RateLimit {
  count: number;
  resetTime: number;
}

const UPLOAD_LIMIT = 10; // uploads per day
const UPLOAD_WINDOW = 24 * 60 * 60; // 24 hours in seconds

export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000); // Convert to seconds
  const key = `ratelimit:${ip}`;

  try {
    // Get current limit
    const limit = await kv.get<RateLimit>(key);

    // If limit exists and not expired, increment count
    if (limit && now < limit.resetTime) {
      if (limit.count >= UPLOAD_LIMIT) {
        return false;
      }

      await kv.hset(key, {
        count: limit.count + 1,
        resetTime: limit.resetTime,
      });
      await kv.expire(key, UPLOAD_WINDOW); // Ensure TTL is set
      return true;
    }

    // Create new limit
    await kv.hset(key, {
      count: 1,
      resetTime: now + UPLOAD_WINDOW,
    });
    await kv.expire(key, UPLOAD_WINDOW);
    return true;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow on error to prevent blocking legitimate users
  }
} 