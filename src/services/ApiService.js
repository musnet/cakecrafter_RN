// src/services/ApiService.js - Communication #60.16: Complete with Category Filtering
// 🚀 ENHANCED: Added category filtering methods while preserving ALL existing functionality
// 🛡️ SAFE: No changes to existing methods that power current functionality
// ✨ NEW: getCakesByCategory(), clearCategoryCache() for category filtering

const API_BASE_URL = 'https://cakecrafterapi.ebita.ai/api';
const IMAGES_BASE_URL = 'https://cakecrafterapi.ebita.ai/media/generated_images/';

// ============================================================================
// ✨ NEW: CATEGORY CACHE MANAGEMENT - Communication #60.16
// ============================================================================
const categoryCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class ApiService {
  // ============================================================================
  // ✨ NEW: CATEGORY FILTERING METHODS - Communication #60.16
  // ============================================================================
  
  /**
   * Get cakes by category with caching and filtering support
   * Clears previous category data when switching categories
   */



    static async getCakesByCategory(categoryKey, options = {}) {
    try {
      const { limit = 20, page = 1, clearPrevious = true, forceRefresh = false } = options;
      
      console.log(`🎯 Communication #60.18 - Fetching cakes for category: ${categoryKey}`);
      
      if (clearPrevious) {
        this.clearCategoryCache();
        console.log(`🧹 Communication #60.18 - Cleared previous category cache`);
      }
      
      const cacheKey = `${categoryKey}_${page}_${limit}`;
      const cachedData = categoryCache.get(cacheKey);
      
      if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
        console.log(`💾 Communication #60.18 - Returning cached data for: ${categoryKey}`);
        return cachedData.data;
      }
      
      const url = `${API_BASE_URL}/cakes/?category=${encodeURIComponent(categoryKey)}&limit=${limit}&offset=${(page - 1) * limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Category API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      categoryCache.set(cacheKey, { data: data, timestamp: Date.now(), category: categoryKey });
      
      console.log(`✅ Communication #60.18 - Loaded ${data.results?.length || 0} cakes for category: ${categoryKey}`);
      return data;
      
    } catch (error) {
      console.error(`❌ Communication #60.18 - Failed to fetch cakes for category ${categoryKey}:`, error);
      
      return {
        results: this.getMockCakesByCategory(categoryKey),
        count: this.getMockCakesByCategory(categoryKey).length,
        next: null,
        previous: null
      };
    }
  }
  

  
  /**
   * Clear category cache (used when switching categories)
   */
  static clearCategoryCache() {
    const cacheSize = categoryCache.size;
    categoryCache.clear();
    console.log(`🧹 Communication #60.16 - Cleared category cache (${cacheSize} entries)`);
  }
  
  /**
   * Get mock cakes filtered by category for fallback
   */
  static getMockCakesByCategory(categoryKey) {
    const allMockCakes = this.getMockCakes();
    
    // Filter by category or return all if no match
    const filteredCakes = allMockCakes.filter(cake => 
      cake.category.toLowerCase() === categoryKey.toLowerCase()
    );
    
    // If no cakes for category, return a few generic ones
    if (filteredCakes.length === 0) {
      return allMockCakes.slice(0, 3).map(cake => ({
        ...cake,
        category: categoryKey,
        name: `${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} ${cake.name}`
      }));
    }
    
    return filteredCakes;
  }
  
  /**
   * Refresh category data (force fetch from API)
   */
  static async refreshCategoryData(categoryKey, options = {}) {
    console.log(`🔄 Communication #60.16 - Force refreshing category: ${categoryKey}`);
    return this.getCakesByCategory(categoryKey, { ...options, forceRefresh: true });
  }

  // ============================================================================
  // EXISTING METHODS (PRESERVED EXACTLY AS-IS) - Communication #60.16
  // ============================================================================
  
  /**
   * Check database and backend health
   * ✅ PRESERVED: Original method unchanged
   */
  static async checkDatabaseHealth() {
    try {
      console.log('🏥 ApiService: Checking database health...');
      
      const response = await fetch(`${API_BASE_URL}/health/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      const healthData = await response.json();
      
      console.log('✅ ApiService: Health check successful:', healthData);
      
      // Return standardized health status
      return {
        connected: true,
        status: healthData.status || 'healthy',
        service: healthData.service || 'CakeCrafter.AI Backend',
        apiVersion: healthData.api_version || '1.0.0',
        environment: healthData.environment || 'production',
        components: healthData.components || {},
        timestamp: healthData.timestamp || new Date().toISOString(),
        responseTime: Date.now(), // Simple response time tracking
      };
      
    } catch (error) {
      console.error('❌ ApiService: Health check failed:', error);
      
      // Return error status
      return {
        connected: false,
        status: 'error',
        error: error.message,
        service: 'CakeCrafter.AI Backend',
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Get cakes from production API with pagination support
   * ✅ PRESERVED: Original method unchanged
   */
  static async getCakes(params = {}) {
    try {
      const { limit = 20, page = 1 } = params;
      const url = `${API_BASE_URL}/cakes/?limit=${limit}&offset=${(page - 1) * limit}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('🍰 ApiService: Loaded cakes from production:', data.results?.length || 0);
      return data;
    } catch (error) {
      console.error('❌ ApiService: Failed to fetch cakes:', error);
      return { results: this.getMockCakes() };
    }
  }

  /**
   * Get categories from production API
   * ✅ PRESERVED: Original method unchanged
   */
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      const data = await response.json();
      
      console.log('📂 ApiService: Loaded categories:', data?.length || 0);
      return data;
    } catch (error) {
      console.error('❌ ApiService: Failed to fetch categories:', error);
      return this.getMockCategories();
    }
  }

  /**
   * Search cakes
   * ✅ PRESERVED: Original method unchanged
   */
  static async searchCakes(query, params = {}) {
    try {
      const { limit = 20 } = params;
      const url = `${API_BASE_URL}/cakes/search/?q=${encodeURIComponent(query)}&limit=${limit}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('❌ ApiService: Search failed:', error);
      return { results: [] };
    }
  }

  /**
   * Mock cake data for fallback
   * ✅ PRESERVED: Original method unchanged
   */
  static getMockCakes() {
    return [
      {
        id: 1,
        name: 'Luxury Birthday Cake',
        price: 'QAR 250',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (1).jpg`,
        rating: 4.9,
        description: 'Exquisite birthday celebration cake',
        category: 'birthday'
      },
      {
        id: 2,
        name: 'Wedding Masterpiece',
        price: 'QAR 800',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (5).jpg`,
        rating: 5.0,
        description: 'Elegant multi-tier wedding cake',
        category: 'wedding'
      },
      {
        id: 3,
        name: 'Corporate Event Cake',
        price: 'QAR 400',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (12).jpg`,
        rating: 4.8,
        description: 'Professional corporate celebration cake',
        category: 'corporate'
      },
      {
        id: 4,
        name: 'Custom Design Cake',
        price: 'QAR 350',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (18).jpg`,
        rating: 4.9,
        description: 'Personalized custom design cake',
        category: 'custom'
      }
    ];
  }

  /**
   * Mock categories for fallback
   * ✅ PRESERVED: Original method unchanged
   */
  static getMockCategories() {
    return [
      {
        id: 1,
        name: 'Birthday',
        nameAr: 'عيد ميلاد',
        count: 25,
        color: '#FF6B6B',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (1).jpg`
      },
      {
        id: 2,
        name: 'Wedding',
        nameAr: 'زفاف',
        count: 18,
        color: '#4ECDC4',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (5).jpg`
      },
      {
        id: 3,
        name: 'Corporate',
        nameAr: 'شركات',
        count: 12,
        color: '#45B7D1',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (12).jpg`
      },
      {
        id: 4,
        name: 'Custom',
        nameAr: 'مخصص',
        count: 30,
        color: '#96CEB4',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (18).jpg`
      }
    ];
  }
}

// ============================================================================
// EXPORTED CONSTANTS (PRESERVED) - Communication #60.16
// ============================================================================

export { API_BASE_URL, IMAGES_BASE_URL };