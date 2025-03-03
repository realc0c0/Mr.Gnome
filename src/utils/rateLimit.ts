interface RateLimitOptions {
  maxAttempts: number;
  timeWindow: number; // in milliseconds
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  check(key: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(
      timestamp => now - timestamp < options.timeWindow
    );
    
    if (validAttempts.length >= options.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map();

  set<T>(key: string, value: T, ttl: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const rateLimiter = new RateLimiter();
export const cache = new Cache();

// Rate limit configurations
export const rateLimits = {
  tap: {
    maxAttempts: 5,
    timeWindow: 5000 // 5 seconds
  },
  taskCompletion: {
    maxAttempts: 3,
    timeWindow: 60000 // 1 minute
  },
  mineCollection: {
    maxAttempts: 1,
    timeWindow: 300000 // 5 minutes
  }
} as const;
