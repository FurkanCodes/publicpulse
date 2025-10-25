import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let suggestionLimiter: Ratelimit | null = null;

function createRateLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  if (suggestionLimiter) {
    return suggestionLimiter;
  }

  const redis = new Redis({ url, token });
  suggestionLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "community-suggestion",
  });

  return suggestionLimiter;
}

export async function limitCommunitySuggestion(key: string) {
  const limiter = createRateLimiter();
  if (!limiter) {
    return { success: true };
  }

  return limiter.limit(key);
}
