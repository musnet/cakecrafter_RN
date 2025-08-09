// src/services/CategoryDataService.js
// Communication #60.3: JSON Data Integration Service
// 🎯 PURPOSE: Load and manage category data from JSON files
// 📁 DATA: 6 category JSON files with bilingual support
// 🔄 FEATURES: Random shuffling, category selection, bilingual content
// 🏠 INTEGRATION: SuperDuperHomeScreen JSON data source

// Import JSON data files
import birthdayCakesData from '../data/birthday_cakes.json';
import weddingCakesData from '../data/wedding_cakes.json';
import sportsCakesData from '../data/sports_cakes.json';
import culturalCakesData from '../data/cultural_cakes.json';
import corporateCakesData from '../data/corporate_cakes.json';
import customCakesData from '../data/custom_cakes.json';

/**
 * CategoryDataService - Comprehensive JSON data management
 * Handles all 6 categories with bilingual support and random ordering
 */
class CategoryDataService {
  
  constructor() {
    // 🎯 Communication #60.3:1 - Initialize category data mapping
    this.categoryDataMap = {
      'birthday': birthdayCakesData,
      'wedding': weddingCakesData,
      'sports': sportsCakesData,
      'cultural': culturalCakesData,
      'corporate': corporateCakesData,
      'custom': customCakesData,
    };
    
    // 🎨 Color mapping for categories (Qatar brand colors)
    this.categoryColors = {
      'birthday': '#F59E0B',    // Birthday - Amber
      'wedding': '#EC4899',     // Wedding - Pink  
      'sports': '#FF6B35',      // Sports - Orange
      'cultural': '#10B981',    // Cultural - Emerald
      'corporate': '#3B82F6',   // Corporate - Blue
      'custom': '#8B5CF6',      // Custom - Purple
    };
    
    console.log('🎯 Communication #60.3:2 - CategoryDataService initialized with 6 categories');
  }
  
  /**
   * Get all categories in formatted structure for UI
   * Returns array compatible with existing SuperDuperHomeScreen
   */
  getAllCategories() {
    try {
      // 🎯 Communication #60.3:3 - Transform JSON data to UI format
      const categories = Object.keys(this.categoryDataMap).map((categoryKey, index) => {
        const categoryData = this.categoryDataMap[categoryKey];
        const category = categoryData.category;
        
        return {
          id: index + 1,
          key: categoryKey,
          name: category.name.en,
          nameAr: category.name.ar,
          image: category.image,
          color: this.categoryColors[categoryKey],
          count: category.count,
          percentage: category.percentage,
          description: `${category.name.en} celebration cakes`,
          descriptionAr: `كيكات ${category.name.ar}`,
        };
      });
      
      // 🎯 Communication #60.3:4 - Sort by percentage (Birthday first with 35%)
      categories.sort((a, b) => b.percentage - a.percentage);
      
      console.log('🎯 Communication #60.3:5 - Loaded categories:', categories.length);
      return categories;
      
    } catch (error) {
      console.error('❌ Communication #60.3:6 - Error loading categories:', error);
      return [];
    }
  }
  
  /**
   * Get cakes for specific category with optional randomization
   * @param {string} categoryKey - Category identifier (birthday, wedding, etc.)
   * @param {boolean} randomize - Whether to shuffle cakes for fresh look
   * @param {number} limit - Maximum number of cakes to return
   */
  getCakesByCategory(categoryKey, randomize = true, limit = null) {
    try {
      // 🎯 Communication #60.3:7 - Get category data
      const categoryData = this.categoryDataMap[categoryKey];
      
      if (!categoryData) {
        console.warn(`⚠️ Communication #60.3:8 - Category not found: ${categoryKey}`);
        return [];
      }
      
      let cakes = [...categoryData.cakes]; // Create copy to avoid mutation
      
      // 🎯 Communication #60.3:9 - Apply randomization for fresh look
      if (randomize) {
        cakes = this.shuffleArray(cakes);
        console.log(`🔄 Communication #60.3:10 - Randomized ${cakes.length} cakes for ${categoryKey}`);
      }
      
      // 🎯 Communication #60.3:11 - Apply limit if specified
      if (limit && limit < cakes.length) {
        cakes = cakes.slice(0, limit);
        console.log(`📏 Communication #60.3:12 - Limited to ${limit} cakes for ${categoryKey}`);
      }
      
      // 🎯 Communication #60.3:13 - Transform to UI-compatible format
      const formattedCakes = cakes.map((cake, index) => ({
        id: `${categoryKey}_${index}_${Date.now()}`, // Unique ID
        name: cake.title.en,
        nameAr: cake.title.ar,
        image: cake.image_url,
        price: `${cake.price} ${cake.currency}`,
        rating: cake.rating,
        purchases: cake.purchases,
        isNew: cake.is_new,
        isInStock: cake.is_in_stock,
        ingredients: cake.ingredients,
        category: categoryKey,
        description: `Delicious ${cake.title.en.toLowerCase()}`,
        descriptionAr: cake.title.ar,
      }));
      
      console.log(`✅ Communication #60.3:14 - Loaded ${formattedCakes.length} cakes for ${categoryKey}`);
      return formattedCakes;
      
    } catch (error) {
      console.error(`❌ Communication #60.3:15 - Error loading cakes for ${categoryKey}:`, error);
      return [];
    }
  }
  
  /**
   * Get the default/recommended category (Birthday - largest with 55 cakes)
   */
  getDefaultCategory() {
    // 🎯 Communication #60.3:16 - Return Birthday as default (35% of all cakes)
    const categories = this.getAllCategories();
    return categories.find(cat => cat.key === 'birthday') || categories[0];
  }
  
  /**
   * Get category by key
   * @param {string} categoryKey - Category identifier
   */
  getCategoryByKey(categoryKey) {
    const categories = this.getAllCategories();
    return categories.find(cat => cat.key === categoryKey);
  }
  
  /**
   * Get featured cakes from multiple categories (mixed selection)
   * @param {number} limit - Number of featured cakes to return
   */
  getFeaturedCakes(limit = 8) {
    try {
      // 🎯 Communication #60.3:17 - Get cakes from all categories
      const allCategoryCakes = [];
      
      Object.keys(this.categoryDataMap).forEach(categoryKey => {
        const cakes = this.getCakesByCategory(categoryKey, false, 3); // 3 from each
        allCategoryCakes.push(...cakes);
      });
      
      // 🎯 Communication #60.3:18 - Filter high-rated and in-stock cakes
      const featuredCakes = allCategoryCakes
        .filter(cake => cake.isInStock && cake.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating); // Sort by rating
      
      // 🎯 Communication #60.3:19 - Randomize and limit
      const randomizedFeatured = this.shuffleArray(featuredCakes).slice(0, limit);
      
      console.log(`⭐ Communication #60.3:20 - Selected ${randomizedFeatured.length} featured cakes`);
      return randomizedFeatured;
      
    } catch (error) {
      console.error('❌ Communication #60.3:21 - Error loading featured cakes:', error);
      return [];
    }
  }
  
  /**
   * Search cakes across all categories
   * @param {string} query - Search query
   * @param {string} language - Language for search (en/ar)
   */
  searchCakes(query, language = 'en') {
    if (!query || query.trim().length < 2) return [];
    
    try {
      // 🎯 Communication #60.3:22 - Search across all categories
      const allCakes = [];
      
      Object.keys(this.categoryDataMap).forEach(categoryKey => {
        const cakes = this.getCakesByCategory(categoryKey, false);
        allCakes.push(...cakes);
      });
      
      // 🎯 Communication #60.3:23 - Perform bilingual search
      const searchTerm = query.toLowerCase().trim();
      const results = allCakes.filter(cake => {
        const nameEn = cake.name.toLowerCase();
        const nameAr = cake.nameAr.toLowerCase();
        const category = cake.category.toLowerCase();
        
        return nameEn.includes(searchTerm) || 
               nameAr.includes(searchTerm) || 
               category.includes(searchTerm);
      });
      
      console.log(`🔍 Communication #60.3:24 - Search "${query}" found ${results.length} results`);
      return results;
      
    } catch (error) {
      console.error('❌ Communication #60.3:25 - Search error:', error);
      return [];
    }
  }
  
  /**
   * Utility: Shuffle array for randomization
   * Fisher-Yates shuffle algorithm
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Get statistics for dashboard/admin
   */
  getStatistics() {
    try {
      const categories = this.getAllCategories();
      const totalCakes = categories.reduce((sum, cat) => sum + cat.count, 0);
      
      return {
        totalCategories: categories.length,
        totalCakes: totalCakes,
        averageCakesPerCategory: Math.round(totalCakes / categories.length),
        largestCategory: categories[0], // Already sorted by percentage
        categoriesBreakdown: categories.map(cat => ({
          name: cat.name,
          count: cat.count,
          percentage: cat.percentage
        }))
      };
    } catch (error) {
      console.error('❌ Communication #60.3:26 - Statistics error:', error);
      return null;
    }
  }
}

// 🎯 Communication #60.3:27 - Export singleton instance
export default new CategoryDataService();

// 🎯 Communication #60.3:28 - Also export class for testing
export { CategoryDataService };
