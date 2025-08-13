// src/config/environment.js - Communication #63.4.6: Fixed Environment Configuration
// 🔧 FIXED: Added Platform import to prevent "undefined" error
// 🔧 FIXED: Safe property assignment with null checks
// 🎯 ENHANCED: Better error handling and environment detection

// ============================================================================
// REQUIRED IMPORTS - Communication #63.4.6
// ============================================================================
import { Platform } from 'react-native';

// ================================
// ENVIRONMENT DETECTION - Communication #63.4.6
// ================================

/**
 * Enhanced environment detection with flexible API testing
 * Allows testing production API while in development mode
 */
const detectEnvironment = () => {
  // ============================================================================
  // 🔧 MANUAL OVERRIDE - Communication #63.4.6
  // ============================================================================
  
  // 🎯 TESTING SCENARIOS:
  // 'DEVELOPMENT'     → http://127.0.0.1:8000/api/ (Local Django)
  // 'PRODUCTION'      → https://cakecrafterapi.ebita.ai/api/ (Remote API)
  // 'DEV_PROD_API'    → Production API while in development mode
  // null              → Automatic detection based on __DEV__
  
  const MANUAL_OVERRIDE = 'DEV_PROD_API'; // ← Change this for testing
  
  // Examples:
  // const MANUAL_OVERRIDE = 'DEVELOPMENT';    // Local Django + Development features
  // const MANUAL_OVERRIDE = 'PRODUCTION';     // Production API + Production features  
  // const MANUAL_OVERRIDE = 'DEV_PROD_API';   // Production API + Development features
  // const MANUAL_OVERRIDE = 'DEV_PROD_API';             // Auto-detect
  
  if (MANUAL_OVERRIDE) {
    console.log(`🔧 Communication #63.4.6 - Manual environment override: ${MANUAL_OVERRIDE}`);
    return MANUAL_OVERRIDE;
  }
  
  // ============================================================================
  // AUTOMATIC DETECTION (Original logic)
  // ============================================================================
  
  // For development, use local Django by default
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'DEVELOPMENT';
  }
  
  // For release builds, use production
  return 'PRODUCTION';
};

// ================================
// ENHANCED ENVIRONMENT CONFIGURATION - Communication #63.4.6
// ================================

const ENVIRONMENTS = {
  DEVELOPMENT: {
    name: 'Development',
    api: {
      baseUrl: 'http://127.0.0.1:8000/api',
      timeout: 15000,
      retries: 2,
    },
    features: {
      debugLogging: true,
      showApiLogs: true,
      enableMockData: true,
      showEnvironmentBadge: true,
    },
    ai: {
      enableRealGeneration: true,
      defaultProvider: 'huggingface_free',
      maxGenerationTime: 180,
    },
    debug: {
      showRequestLogs: true,
      showResponseLogs: true,
      showErrorDetails: true,
      networkTimeout: 30000,
    }
  },
  
  PRODUCTION: {
    name: 'Production',
    api: {
      baseUrl: 'https://cakecrafterapi.ebita.ai/api',
      timeout: 30000,
      retries: 3,
    },
    features: {
      debugLogging: false,
      showApiLogs: false,
      enableMockData: false,
      showEnvironmentBadge: false,
    },
    ai: {
      enableRealGeneration: true,
      defaultProvider: 'auto',
      maxGenerationTime: 300,
    },
    debug: {
      showRequestLogs: false,
      showResponseLogs: false,
      showErrorDetails: false,
      networkTimeout: 45000,
    }
  },
  
  // ============================================================================
  // 🎯 DEV_PROD_API - Communication #63.4.6
  // ============================================================================
  DEV_PROD_API: {
    name: 'Development with Production API',
    api: {
      baseUrl: 'https://cakecrafterapi.ebita.ai/api', // 🌐 Production API
      timeout: 30000,
      retries: 3,
    },
    features: {
      debugLogging: true,        // 🔧 Keep development debugging
      showApiLogs: true,         // 🔧 Keep development logging
      enableMockData: false,     // 🌐 No mock data (use real API)
      showEnvironmentBadge: true, // 🔧 Show environment for clarity
    },
    ai: {
      enableRealGeneration: true,
      defaultProvider: 'auto',   // 🌐 Use production provider selection
      maxGenerationTime: 300,    // 🌐 Production timeouts
    },
    debug: {
      showRequestLogs: true,     // 🔧 Keep development request logging
      showResponseLogs: true,    // 🔧 Keep development response logging
      showErrorDetails: true,    // 🔧 Keep development error details
      networkTimeout: 45000,     // 🌐 Production network timeout
    }
  }
};

// ============================================================================
// 🔧 ENHANCED CURRENT ENVIRONMENT - Communication #63.4.6
// ============================================================================

const CURRENT_ENV = detectEnvironment();

// 🔧 FIXED: Safe environment configuration with null checks
let CONFIG = null;

try {
  // Ensure we have a valid environment configuration
  if (ENVIRONMENTS[CURRENT_ENV]) {
    CONFIG = { ...ENVIRONMENTS[CURRENT_ENV] }; // Create a copy to avoid mutations
    
    // Add environment metadata safely
    CONFIG.environment = CURRENT_ENV;
    CONFIG.isProduction = CURRENT_ENV === 'PRODUCTION';
    CONFIG.isDevelopment = CURRENT_ENV === 'DEVELOPMENT';
    CONFIG.isDevProdAPI = CURRENT_ENV === 'DEV_PROD_API';
    
    // 🔧 FIXED: Safe Platform.OS assignment with fallback
    CONFIG.platform = Platform && Platform.OS ? Platform.OS : 'unknown';
    CONFIG.timestamp = new Date().toISOString();
    
    // Special handling for DEV_PROD_API
    if (CURRENT_ENV === 'DEV_PROD_API') {
      CONFIG.displayName = 'DEV → PROD API';
      CONFIG.description = 'Development mode using Production API';
    }
    
  } else {
    // Fallback configuration if environment is not found
    console.warn(`⚠️ Communication #63.4.6 - Unknown environment: ${CURRENT_ENV}, using fallback`);
    CONFIG = {
      name: 'Fallback',
      environment: 'DEVELOPMENT',
      api: {
        baseUrl: 'https://cakecrafterapi.ebita.ai/api',
        timeout: 30000,
        retries: 3,
      },
      features: {
        debugLogging: true,
        showApiLogs: true,
        enableMockData: false,
        showEnvironmentBadge: true,
      },
      ai: {
        enableRealGeneration: true,
        defaultProvider: 'huggingface_free',
        maxGenerationTime: 300,
      },
      debug: {
        showRequestLogs: true,
        showResponseLogs: true,
        showErrorDetails: true,
        networkTimeout: 45000,
      },
      isProduction: false,
      isDevelopment: true,
      isDevProdAPI: false,
      platform: Platform && Platform.OS ? Platform.OS : 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
  
} catch (error) {
  console.error('❌ Communication #63.4.6 - Environment configuration error:', error);
  
  // Emergency fallback configuration
  CONFIG = {
    name: 'Emergency Fallback',
    environment: 'DEVELOPMENT',
    api: {
      baseUrl: 'https://cakecrafterapi.ebita.ai/api',
      timeout: 30000,
      retries: 3,
    },
    features: {
      debugLogging: true,
      showApiLogs: true,
      enableMockData: false,
      showEnvironmentBadge: true,
    },
    ai: {
      enableRealGeneration: true,
      defaultProvider: 'huggingface_free',
      maxGenerationTime: 300,
    },
    debug: {
      showRequestLogs: true,
      showResponseLogs: true,
      showErrorDetails: true,
      networkTimeout: 45000,
    },
    isProduction: false,
    isDevelopment: true,
    isDevProdAPI: false,
    platform: 'unknown',
    timestamp: new Date().toISOString(),
    error: error.message,
  };
}

// ============================================================================
// ENVIRONMENT UTILITIES - Communication #63.4.6
// ============================================================================

export const EnvironmentUtils = {
  /**
   * Get current environment name
   */
  getCurrentEnvironment: () => CONFIG?.environment || 'UNKNOWN',
  
  /**
   * Check if running in development
   */
  isDevelopment: () => CONFIG?.isDevelopment || false,
  
  /**
   * Check if running in production
   */
  isProduction: () => CONFIG?.isProduction || false,
  
  /**
   * Get API base URL for current environment
   */
  getApiBaseUrl: () => CONFIG?.api?.baseUrl || 'https://cakecrafterapi.ebita.ai/api',
  
  /**
   * Get full API URL with endpoint
   */
  getApiUrl: (endpoint) => {
    const baseUrl = CONFIG?.api?.baseUrl || 'https://cakecrafterapi.ebita.ai/api';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
  },
  
  /**
   * Check if debug logging is enabled
   */
  isDebugEnabled: () => CONFIG?.features?.debugLogging || false,
  
  /**
   * Log debug message if debugging is enabled
   */
  debugLog: (message, data = null) => {
    if (CONFIG?.features?.debugLogging) {
      const timestamp = new Date().toLocaleTimeString();
      const env = CONFIG?.environment || 'UNKNOWN';
      console.log(`🐛 [${env}] ${timestamp}: ${message}`, data || '');
    }
  },
  
  /**
   * Log API request if enabled
   */
  logApiRequest: (method, url, data = null) => {
    if (CONFIG?.debug?.showRequestLogs) {
      console.log(`📤 Communication #63.4.6 - API Request [${CONFIG?.environment}]:`, {
        method,
        url,
        data,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  /**
   * Log API response if enabled
   */
  logApiResponse: (url, response, status) => {
    if (CONFIG?.debug?.showResponseLogs) {
      console.log(`📥 Communication #63.4.6 - API Response [${CONFIG?.environment}]:`, {
        url,
        status,
        response: CONFIG?.isDevelopment ? response : '[Hidden in production]',
        timestamp: new Date().toISOString()
      });
    }
  },
  
  /**
   * Log API error with details
   */
  logApiError: (url, error, context = '') => {
    const errorData = {
      url,
      error: error.message || error,
      context,
      environment: CONFIG?.environment || 'UNKNOWN',
      timestamp: new Date().toISOString()
    };
    
    if (CONFIG?.debug?.showErrorDetails) {
      console.error(`❌ Communication #63.4.6 - API Error [${CONFIG?.environment}]:`, errorData);
    } else {
      console.error(`❌ API Error: ${error.message || error}`);
    }
  },
  
  /**
   * Get environment display info
   */
  getEnvironmentInfo: () => ({
    name: CONFIG?.name || 'Unknown',
    environment: CONFIG?.environment || 'UNKNOWN',
    apiUrl: CONFIG?.api?.baseUrl || 'Unknown',
    platform: CONFIG?.platform || 'unknown',
    debugEnabled: CONFIG?.features?.debugLogging || false,
    timestamp: CONFIG?.timestamp || new Date().toISOString()
  }),
  
  /**
   * Test API connectivity
   */
  testApiConnectivity: async () => {
    try {
      const testUrl = EnvironmentUtils.getApiUrl('health/');
      EnvironmentUtils.debugLog('Testing API connectivity', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        timeout: CONFIG?.api?.timeout || 30000,
      });
      
      const result = {
        success: response.ok,
        status: response.status,
        environment: CONFIG?.environment || 'UNKNOWN',
        url: testUrl,
        timestamp: new Date().toISOString()
      };
      
      EnvironmentUtils.logApiResponse(testUrl, result, response.status);
      return result;
      
    } catch (error) {
      EnvironmentUtils.logApiError('health/', error, 'connectivity test');
      return {
        success: false,
        error: error.message,
        environment: CONFIG?.environment || 'UNKNOWN',
        timestamp: new Date().toISOString()
      };
    }
  }
};

// ================================
// ENVIRONMENT CONSTANTS - Communication #63.4.6
// ================================

export const ENV_CONSTANTS = {
  DEVELOPMENT: 'DEVELOPMENT',
  PRODUCTION: 'PRODUCTION',
  DEV_PROD_API: 'DEV_PROD_API',
  API_TIMEOUT: CONFIG?.api?.timeout || 30000,
  API_RETRIES: CONFIG?.api?.retries || 3,
  DEBUG_ENABLED: CONFIG?.features?.debugLogging || false,
};

// ================================
// MAIN EXPORT - Communication #63.4.6
// ================================

// Main configuration object
export const Environment = CONFIG;

// Default export
export default CONFIG;

// ================================
// INITIALIZATION LOG - Communication #63.4.6
// ================================

if (CONFIG?.features?.debugLogging) {
  console.log('🌐 Communication #63.4.6 - Environment Configuration Loaded:', {
    environment: CONFIG?.environment || 'UNKNOWN',
    apiUrl: CONFIG?.api?.baseUrl || 'Unknown',
    platform: CONFIG?.platform || 'unknown',
    debugEnabled: CONFIG?.features?.debugLogging || false,
    timestamp: CONFIG?.timestamp || new Date().toISOString()
  });
}