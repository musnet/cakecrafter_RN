// src/config/api.config.js - Communication #63.1: API Endpoint Configuration
// 🌐 API: Complete endpoint configuration for all CakeCrafter services
// 🎯 ENVIRONMENT: Works with environment.js for dynamic API switching
// ⚡ FEATURES: AI generation, cake management, cart operations
// 🔧 ENDPOINTS: Development and Production API support

import { Environment, EnvironmentUtils } from './environment';

// ================================
// API ENDPOINT CONFIGURATION - Communication #63.1
// ================================

/**
 * Core API endpoints configuration
 * All endpoints are relative to the base URL from environment config
 */
const API_ENDPOINTS = {
  // ============================================================================
  // HEALTH & STATUS - Communication #63.1
  // ============================================================================
  HEALTH: 'health/',
  STATUS: 'status/',
  
  // ============================================================================
  // AUTHENTICATION - Communication #63.1
  // ============================================================================
  AUTH: {
    LOGIN: 'auth/login/',
    LOGOUT: 'auth/logout/',
    REGISTER: 'auth/register/',
    GUEST_SESSION: 'auth/guest-session/',
    REFRESH_TOKEN: 'auth/refresh/',
    VERIFY_TOKEN: 'auth/verify/',
  },
  
  // ============================================================================
  // CAKE MANAGEMENT - Communication #63.1
  // ============================================================================
  CAKES: {
    LIST: 'cakes/',
    DETAIL: (id) => `cakes/${id}/`,
    SEARCH: 'cakes/search/',
    CATEGORIES: 'categories/',
    BY_CATEGORY: (category) => `cakes/?category=${category}`,
    FEATURED: 'cakes/featured/',
    POPULAR: 'cakes/popular/',
  },
  
  // ============================================================================
  // AI GENERATION - Communication #63.1 (PRIMARY FOCUS)
  // ============================================================================
  AI: {
    // Main AI generation endpoint
    GENERATE: 'cakes/ai-generate/',
    
    // Prompt enhancement
    ENHANCE_PROMPT: 'cakes/enhance-prompt/',
    
    // Provider management
    PROVIDERS: 'cakes/providers/',
    PROVIDER_STATUS: (providerId) => `cakes/providers/${providerId}/status/`,
    
    // Generation management
    GENERATIONS: 'cakes/generations/',
    GENERATION_DETAIL: (generationId) => `cakes/generations/${generationId}/`,
    GENERATION_STATUS: (generationId) => `cakes/generation-status/${generationId}/`,
    
    // Generation history
    USER_GENERATIONS: (userId) => `cakes/generations/?user_id=${userId}`,
    RECENT_GENERATIONS: 'cakes/generations/recent/',
  },
  
  // ============================================================================
  // CART & ORDERS - Communication #63.1
  // ============================================================================
  CART: {
    GET: 'cart/',
    ADD: 'cart/add/',
    UPDATE: 'cart/update/',
    REMOVE: 'cart/remove/',
    CLEAR: 'cart/clear/',
  },
  
  ORDERS: {
    LIST: 'orders/',
    CREATE: 'orders/create/',
    DETAIL: (orderId) => `orders/${orderId}/`,
    STATUS: (orderId) => `orders/${orderId}/status/`,
  },
  
  // ============================================================================
  // USER MANAGEMENT - Communication #63.1
  // ============================================================================
  USER: {
    PROFILE: 'user/profile/',
    PREFERENCES: 'user/preferences/',
    FAVORITES: 'user/favorites/',
    HISTORY: 'user/history/',
  },
};

// ================================
// API CONFIGURATION CLASS - Communication #63.1
// ================================

class ApiConfig {
  constructor() {
    this.baseUrl = Environment.api.baseUrl;
    this.timeout = Environment.api.timeout;
    this.retries = Environment.api.retries;
    this.environment = Environment.environment;
  }
  
  /**
   * Get full URL for an endpoint
   */
  getUrl(endpoint) {
    return EnvironmentUtils.getApiUrl(endpoint);
  }
  
  /**
   * Get default request headers
   */
  getHeaders(additionalHeaders = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Version': '1.0.0',
      'X-Platform': Environment.platform,
      'X-Environment': this.environment,
    };
    
    return { ...defaultHeaders, ...additionalHeaders };
  }
  
  /**
   * Get default fetch options
   */
  getRequestOptions(options = {}) {
    const defaultOptions = {
      timeout: this.timeout,
      headers: this.getHeaders(options.headers),
    };
    
    return { ...defaultOptions, ...options };
  }
  
  /**
   * Make API request with environment-aware configuration
   */
  async makeRequest(endpoint, options = {}) {
    const url = this.getUrl(endpoint);
    const requestOptions = this.getRequestOptions(options);
    
    // Log request if enabled
    EnvironmentUtils.logApiRequest(
      options.method || 'GET',
      url,
      options.body
    );
    
    try {
      const response = await fetch(url, requestOptions);
      
      // Log response if enabled
      EnvironmentUtils.logApiResponse(url, null, response.status);
      
      return response;
      
    } catch (error) {
      // Log error
      EnvironmentUtils.logApiError(url, error, 'makeRequest');
      throw error;
    }
  }
  
  // ============================================================================
  // AI GENERATION SPECIFIC METHODS - Communication #63.1
  // ============================================================================
  
  /**
   * Generate cake using AI
   */
  async generateCake(prompt, provider = 'auto', options = {}) {
    const requestBody = {
      prompt,
      provider,
      user_id: options.userId || 1000, // Guest user ID
      style: options.style || 'elegant',
      occasion: options.occasion || 'general',
      ...options
    };
    
    EnvironmentUtils.debugLog('AI Generation Request', requestBody);
    
    return this.makeRequest(API_ENDPOINTS.AI.GENERATE, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }
  
  /**
   * Enhance prompt using AI
   */
  async enhancePrompt(prompt, style = 'elegant', occasion = 'general') {
    const requestBody = {
      prompt,
      style,
      occasion
    };
    
    EnvironmentUtils.debugLog('Prompt Enhancement Request', requestBody);
    
    return this.makeRequest(API_ENDPOINTS.AI.ENHANCE_PROMPT, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }
  
  /**
   * Get available AI providers
   */
  async getAIProviders() {
    EnvironmentUtils.debugLog('Fetching AI Providers');
    
    return this.makeRequest(API_ENDPOINTS.AI.PROVIDERS, {
      method: 'GET',
    });
  }
  
  /**
   * Get generation status
   */
  async getGenerationStatus(generationId) {
    EnvironmentUtils.debugLog('Checking Generation Status', { generationId });
    
    return this.makeRequest(API_ENDPOINTS.AI.GENERATION_STATUS(generationId), {
      method: 'GET',
    });
  }
  
  /**
   * Poll generation status until completion
   */
  async pollGenerationStatus(generationId, onProgress = null, maxAttempts = 30) {
    EnvironmentUtils.debugLog('Starting Generation Polling', { 
      generationId, 
      maxAttempts 
    });
    
    let attempts = 0;
    const delay = Environment.isDevelopment ? 2000 : 3000; // 2s dev, 3s prod
    
    while (attempts < maxAttempts) {
      try {
        const response = await this.getGenerationStatus(generationId);
        const data = await response.json();
        
        if (onProgress) {
          onProgress(data);
        }
        
        // Check if completed
        if (data.status === 'completed' || data.status === 'failed') {
          EnvironmentUtils.debugLog('Generation Polling Complete', {
            status: data.status,
            attempts: attempts + 1
          });
          return data;
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
        
      } catch (error) {
        EnvironmentUtils.logApiError(
          `generation-status/${generationId}`,
          error,
          `polling attempt ${attempts + 1}`
        );
        
        // Continue polling unless too many failures
        if (attempts > 5) {
          throw new Error(`Polling failed after ${attempts} attempts: ${error.message}`);
        }
      }
    }
    
    throw new Error(`Generation polling timeout after ${maxAttempts} attempts`);
  }
  
  // ============================================================================
  // STANDARD API METHODS - Communication #63.1
  // ============================================================================
  
  /**
   * Get cakes with pagination
   */
  async getCakes(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `${API_ENDPOINTS.CAKES.LIST}?${queryParams}` : API_ENDPOINTS.CAKES.LIST;
    
    return this.makeRequest(endpoint, { method: 'GET' });
  }
  
  /**
   * Search cakes
   */
  async searchCakes(query, params = {}) {
    const searchParams = new URLSearchParams({ q: query, ...params }).toString();
    const endpoint = `${API_ENDPOINTS.CAKES.SEARCH}?${searchParams}`;
    
    return this.makeRequest(endpoint, { method: 'GET' });
  }
  
  /**
   * Get categories
   */
  async getCategories() {
    return this.makeRequest(API_ENDPOINTS.CAKES.CATEGORIES, { method: 'GET' });
  }
  
  /**
   * Test API connectivity
   */
  async testConnectivity() {
    EnvironmentUtils.debugLog('Testing API Connectivity');
    
    return this.makeRequest(API_ENDPOINTS.HEALTH, { method: 'GET' });
  }
}

// ================================
// API UTILITY FUNCTIONS - Communication #63.1
// ================================

export const ApiUtils = {
  /**
   * Handle API response with error checking
   */
  async handleResponse(response) {
    try {
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      return { success: true, data };
      
    } catch (error) {
      EnvironmentUtils.logApiError(response.url, error, 'handleResponse');
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Retry API request with exponential backoff
   */
  async retryRequest(requestFn, maxRetries = Environment.api.retries) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        return result;
        
      } catch (error) {
        lastError = error;
        EnvironmentUtils.debugLog(`Retry attempt ${attempt}/${maxRetries}`, error.message);
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff: 1s, 2s, 4s, etc.
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },
  
  /**
   * Build query string from parameters
   */
  buildQueryString(params) {
    const validParams = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      
    return new URLSearchParams(validParams).toString();
  }
};

// ================================
// EXPORTS - Communication #63.1
// ================================

// Create singleton instance
export const apiConfig = new ApiConfig();

// Export endpoints for direct access
export { API_ENDPOINTS };

// Export configuration class
export { ApiConfig };

// Default export
export default apiConfig;

// ================================
// INITIALIZATION - Communication #63.1
// ================================

if (Environment.features.debugLogging) {
  console.log('🔧 Communication #63.1 - API Configuration Loaded:', {
    baseUrl: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    environment: apiConfig.environment,
    endpoints: Object.keys(API_ENDPOINTS).length,
    timestamp: new Date().toISOString()
  });
}
