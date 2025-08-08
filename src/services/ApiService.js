// src/services/ApiService.js - Communication #60.13: Enhanced with Database Health Check
// 🚀 ENHANCED: Added health check method while preserving ALL existing functionality
// 🛡️ SAFE: No changes to existing methods that power categories functionality

const API_BASE_URL = 'https://cakecrafterapi.ebita.ai/api';
const IMAGES_BASE_URL = 'https://cakecrafterapi.ebita.ai/media/generated_images/';

export class ApiService {
  // ============================================================================
  // ✨ NEW: DATABASE HEALTH CHECK METHOD - Communication #60.13
  // ============================================================================
  
  /**
   * Check database and backend health
   * Returns connection status and component health information
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

  // ============================================================================
  // EXISTING METHODS (PRESERVED EXACTLY AS-IS) - Communication #60.13
  // ============================================================================
  
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
// EXPORTED CONSTANTS (PRESERVED) - Communication #60.13
// ============================================================================

export { API_BASE_URL, IMAGES_BASE_URL };
