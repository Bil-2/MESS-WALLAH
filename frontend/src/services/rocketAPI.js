// MESS WALLAH - Rocket-Speed API Service
import { cachedFetch, debouncedFetch, throttledFetch } from '../utils/apiCache';

class RocketAPI {
  constructor() {
    this.baseURL = '/api';
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxConcurrentRequests = 6;
    this.activeRequests = 0;
    
    // Performance metrics
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      averageResponseTime: 0,
      errors: 0
    };
  }

  // Enhanced request with automatic optimization
  async request(endpoint, options = {}) {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Determine the best fetch strategy
      const strategy = this.determineFetchStrategy(endpoint, options);
      let response;

      switch (strategy) {
        case 'cached':
          response = await cachedFetch(`${this.baseURL}${endpoint}`, options);
          break;
        case 'debounced':
          response = await debouncedFetch(`${this.baseURL}${endpoint}`, options);
          break;
        case 'throttled':
          response = await throttledFetch(`${this.baseURL}${endpoint}`, options);
          break;
        default:
          response = await this.queuedFetch(`${this.baseURL}${endpoint}`, options);
      }

      // Update metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, true);

      return response;
    } catch (error) {
      this.metrics.errors++;
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Determine optimal fetch strategy based on endpoint and options
  determineFetchStrategy(endpoint, options) {
    // Use cached fetch for GET requests to static data
    if (!options.method || options.method === 'GET') {
      if (endpoint.includes('/rooms') || endpoint.includes('/featured')) {
        return 'cached';
      }
      if (endpoint.includes('/search')) {
        return 'debounced';
      }
    }
    
    // Use throttled fetch for frequent operations
    if (endpoint.includes('/analytics') || endpoint.includes('/stats')) {
      return 'throttled';
    }
    
    return 'queued';
  }

  // Queued fetch with concurrency control
  async queuedFetch(url, options) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  // Process request queue with concurrency limits
  async processQueue() {
    if (this.isProcessingQueue || this.activeRequests >= this.maxConcurrentRequests) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const { url, options, resolve, reject } = this.requestQueue.shift();
      this.activeRequests++;

      fetch(url, options)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
    }

    this.isProcessingQueue = false;
  }

  // Update performance metrics
  updateMetrics(responseTime, success) {
    if (success) {
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + responseTime) / 2;
    }
  }

  // Optimized API methods
  async getRooms(params = {}) {
    return this.request('/rooms', { 
      params,
      method: 'GET'
    });
  }

  async getFeaturedRooms() {
    return this.request('/rooms/featured', {
      method: 'GET'
    });
  }

  async searchRooms(query, filters = {}) {
    return this.request('/rooms/search', {
      params: { q: query, ...filters },
      method: 'GET'
    });
  }

  async getRoomDetails(id) {
    return this.request(`/rooms/${id}`, {
      method: 'GET'
    });
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
      bypassCache: true
    });
  }

  async getUserBookings() {
    return this.request('/bookings/my', {
      method: 'GET'
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      bypassCache: true
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      bypassCache: true
    });
  }

  // Batch requests for multiple operations
  async batchRequest(requests) {
    const promises = requests.map(({ endpoint, options }) => 
      this.request(endpoint, options)
    );
    
    return Promise.allSettled(promises);
  }

  // Preload critical data
  async preloadCriticalData() {
    const criticalRequests = [
      { endpoint: '/rooms/featured', options: { method: 'GET' } },
      { endpoint: '/rooms/stats', options: { method: 'GET' } }
    ];

    return this.batchRequest(criticalRequests);
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.cacheHits / this.metrics.totalRequests * 100,
      errorRate: this.metrics.errors / this.metrics.totalRequests * 100
    };
  }

  // Clear cache and reset
  reset() {
    this.cache.clear();
    this.pendingRequests.clear();
    this.requestQueue = [];
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      averageResponseTime: 0,
      errors: 0
    };
  }
}

// Create singleton instance
const rocketAPI = new RocketAPI();

// Export both the class and instance
export { RocketAPI };
export default rocketAPI;
