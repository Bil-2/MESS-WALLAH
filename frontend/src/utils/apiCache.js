// MESS WALLAH - Advanced API Cache System
// Prevents infinite loops and optimizes performance

class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.pendingRequests = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.requestCount = 0;
    
    // Debug logging
    this.debug = true;
    this.log = (message, data = '') => {
      if (this.debug) {
        console.log(`[API Cache] ${message}`, data);
      }
    };
  }

  // Generate unique cache key
  generateKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${paramString ? '?' + paramString : ''}`;
  }

  // Check if cache entry is valid
  isValid(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return false;
    const isValid = Date.now() - timestamp < this.CACHE_DURATION;
    if (!isValid) {
      this.log(`Cache expired for: ${key}`);
      this.cache.delete(key);
      this.timestamps.delete(key);
    }
    return isValid;
  }

  // Get cached data if valid
  get(url, params = {}) {
    const key = this.generateKey(url, params);
    if (this.isValid(key)) {
      this.log(`✅ Cache HIT: ${key}`);
      return this.cache.get(key);
    }
    this.log(`❌ Cache MISS: ${key}`);
    return null;
  }

  // Set cache data
  set(url, params = {}, data) {
    const key = this.generateKey(url, params);
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    this.log(`💾 Cached: ${key}`);
    
    // Cleanup old entries if cache gets too large
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now - timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        this.log(`🗑️ Cleaned up expired: ${key}`);
      }
    }
  }

  // Clear all cache
  clearAll() {
    this.cache.clear();
    this.timestamps.clear();
    this.pendingRequests.clear();
    this.log('🧹 All cache cleared');
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      requestCount: this.requestCount,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
const apiCache = new APICache();

// Enhanced fetch with caching and deduplication
export const cachedFetch = async (url, options = {}) => {
  const { params = {}, bypassCache = false, ...fetchOptions } = options;
  const key = apiCache.generateKey(url, params);
  
  // Check cache first (unless bypassed)
  if (!bypassCache) {
    const cachedData = apiCache.get(url, params);
    if (cachedData) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(cachedData)
      });
    }
  }

  // Check if request is already pending (deduplication)
  if (apiCache.pendingRequests.has(key)) {
    apiCache.log(`🔄 Request already pending, waiting: ${key}`);
    return apiCache.pendingRequests.get(key);
  }

  try {
    // Build URL with params
    const urlWithParams = new URL(url, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        urlWithParams.searchParams.append(key, params[key]);
      }
    });

    apiCache.log(`🚀 Making request: ${urlWithParams.toString()}`);
    apiCache.requestCount++;

    // Create the request promise
    const requestPromise = fetch(urlWithParams.toString(), fetchOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          // Cache successful responses
          apiCache.set(url, params, data);
          return {
            ok: true,
            status: response.status,
            json: () => Promise.resolve(data)
          };
        }
        return response;
      })
      .finally(() => {
        // Remove from pending requests
        apiCache.pendingRequests.delete(key);
      });

    // Store as pending request
    apiCache.pendingRequests.set(key, requestPromise);
    
    return requestPromise;

  } catch (error) {
    apiCache.log(`❌ Request failed: ${url}`, error.message);
    apiCache.pendingRequests.delete(key);
    throw error;
  }
};

// Debounced fetch with additional throttling
export const debouncedFetch = (() => {
  const debounceMap = new Map();
  
  return async (url, options = {}) => {
    const key = apiCache.generateKey(url, options.params || {});
    
    // Clear existing timeout for this key
    if (debounceMap.has(key)) {
      clearTimeout(debounceMap.get(key).timeout);
    }
    
    // Return existing promise if available
    if (debounceMap.has(key) && debounceMap.get(key).promise) {
      apiCache.log(`⏳ Using debounced promise: ${key}`);
      return debounceMap.get(key).promise;
    }
    
    // Create new debounced promise
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          const result = await cachedFetch(url, options);
          debounceMap.delete(key);
          resolve(result);
        } catch (error) {
          debounceMap.delete(key);
          reject(error);
        }
      }, 100); // 100ms debounce
      
      debounceMap.set(key, { timeout, promise: null });
    });
    
    // Store the promise
    debounceMap.get(key).promise = promise;
    
    return promise;
  };
})();

// Request throttling utility
export const throttledFetch = (() => {
  const lastRequestTime = new Map();
  const MIN_INTERVAL = 1000; // 1 second minimum between same requests
  
  return async (url, options = {}) => {
    const key = apiCache.generateKey(url, options.params || {});
    const now = Date.now();
    const lastTime = lastRequestTime.get(key) || 0;
    
    if (now - lastTime < MIN_INTERVAL) {
      apiCache.log(`🚫 Request throttled: ${key}`);
      // Return cached data if available
      const cached = apiCache.get(url, options.params);
      if (cached) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(cached)
        });
      }
      // Wait for minimum interval
      await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - (now - lastTime)));
    }
    
    lastRequestTime.set(key, Date.now());
    return cachedFetch(url, options);
  };
})();

// Export cache instance for debugging
export { apiCache };
export default apiCache;
