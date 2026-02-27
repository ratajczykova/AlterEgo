/**
 * Hackathon in-memory rate limiter using Map.
 * Intended for deployment to serverless (like Vercel) where state resets occasionally.
 * Provides a highly efficient 0-dependency deterrent against basic spam scripts.
 */

interface RateLimitData {
    count: number;
    lastReset: number;
}

const reqCache = new Map<string, RateLimitData>();
const MAX_REQUESTS = 5; // 5 hits per IP
const WINDOW_MS = 60 * 1000; // 1 minute

export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const data = reqCache.get(ip);

    if (!data) {
        reqCache.set(ip, { count: 1, lastReset: now });
        return false;
    }

    if (now - data.lastReset > WINDOW_MS) {
        // Reset the window
        reqCache.set(ip, { count: 1, lastReset: now });
        return false;
    }

    if (data.count >= MAX_REQUESTS) {
        return true; // Limit exceeded
    }

    // Increment count
    data.count++;
    reqCache.set(ip, data);
    return false;
}
