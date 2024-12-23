interface RateLimit {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimit>();

const UPLOAD_LIMIT = 10; // uploads per day
const UPLOAD_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  // Clean up expired entries
  if (limit && now > limit.resetTime) {
    rateLimits.delete(ip);
  }

  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, {
      count: 1,
      resetTime: now + UPLOAD_WINDOW,
    });
    return true;
  }

  const currentLimit = rateLimits.get(ip)!;
  if (currentLimit.count >= UPLOAD_LIMIT) {
    return false;
  }

  currentLimit.count += 1;
  return true;
} 