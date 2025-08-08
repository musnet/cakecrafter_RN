// src/services/ApiService.js - FIXED VERSION
const API_BASE_URL = 'https://cakecrafterapi.ebita.ai/api';
const IMAGES_BASE_URL = 'https://cakecrafterapi.ebita.ai/media/generated_images/';

export class ApiService {
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
      }
    ];
  }

  static getMockCategories() {
    return [
      {
        id: 1,
        name: 'Birthday',
        nameAr: 'عيد ميلاد',
        count: 25,
        color: '#FF6B6B',
        image: `${IMAGES_BASE_URL}Cake_imaes199993 (1).jpg`
      }
    ];
  }
}
