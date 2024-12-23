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
    const count = await kv.incr(key);
    
    // If this is the first request, set expiry
    if (count === 1) {
      await kv.expire(key, UPLOAD_WINDOW);
    }

    // Check if over limit
    if (count > UPLOAD_LIMIT) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow on error to prevent blocking legitimate users
  }
} 