import { kv } from '@vercel/kv';

const UPLOAD_LIMIT = 10; // uploads per day
const UPLOAD_WINDOW = 24 * 60 * 60; // 24 hours in seconds

// Clean up old rate limit keys
async function cleanupOldKeys(ip: string): Promise<void> {
  try {
    await kv.del(`ratelimit:${ip}`);
  } catch (error) {
    // Ignore cleanup errors
  }
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000); // Convert to seconds
  const key = `rate:${ip}`;

  try {
    // Clean up old keys
    await cleanupOldKeys(ip);

    // Get current count and last reset time
    const [count = 0, resetTime = 0] = await kv.mget<[number, number]>([
      `${key}:count`,
      `${key}:reset`
    ]);

    // Check if we need to reset (it's been more than 24 hours)
    if (now > resetTime) {
      // Set new values
      await kv.pipeline()
        .set(`${key}:count`, 1)
        .set(`${key}:reset`, now + UPLOAD_WINDOW)
        .expire(`${key}:count`, UPLOAD_WINDOW)
        .expire(`${key}:reset`, UPLOAD_WINDOW)
        .exec();
      return true;
    }

    // Check if over limit
    if (count >= UPLOAD_LIMIT) {
      return false;
    }

    // Increment count
    await kv.incr(`${key}:count`);
    return true;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow on error to prevent blocking legitimate users
  }
} 