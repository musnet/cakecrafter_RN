// src/i18n/index.js - Communication #60.10: Clean i18n Configuration (No RNLocalize)
// 🌐 CLEAN: No react-native-localize dependencies
// ⚡ FIXED: Removes ALL RNLocalize references for immediate app startup

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================================
// LANGUAGE RESOURCES
// ================================

const resources = {
  en: {
    translation: {
      // App
      app: {
        name: 'CakeCrafter.AI'
      },
      
      // Common
      common: {
        ok: 'OK',
        cancel: 'Cancel',
        explore: 'Explore',
        cakes: 'cakes available',
        comingSoon: 'Coming soon!',
        poweredBy: 'Powered by CakeCrafter.AI Qatar'
      },
      
      // Time greetings
      time: {
        morning: 'Good Morning',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening',
        night: 'Good Night'
      },
      
      // Language
      language: {
        current: 'Current Language',
        selectLanguage: 'Select Language'
      },
      
      // SuperDuperHome
      superDuperHome: {
        searchPlaceholder: 'Search amazing cakes...',
        loadingCakes: 'Loading amazing cakes...',
        
        // Quick Actions
        quickActions: {
          aiGenerate: 'AI Generate',
          scanQr: 'Scan QR',
          custom: 'Custom'
        },
        
        // Categories
        categories: {
          title: 'Categories',
          seeAll: 'All categories'
        },
        
        // Featured
        featured: {
          title: 'Featured Cakes',
          seeAll: 'See All'
        },
        
        // Gallery
        gallery: {
          viewDesign: 'View Design',
          designDescription: 'Beautiful cake design for inspiration'
        },
        
        // Cakes
        cakes: {
          defaultName: 'Delicious Cake'
        }
      }
    }
  },
  
  ar: {
    translation: {
      // App
      app: {
        name: 'CakeCrafter.AI'
      },
      
      // Common
      common: {
        ok: 'موافق',
        cancel: 'إلغاء',
        explore: 'استكشاف',
        cakes: 'كعكات متوفرة',
        comingSoon: 'قريباً!',
        poweredBy: 'مدعوم من CakeCrafter.AI قطر'
      },
      
      // Time greetings
      time: {
        morning: 'صباح الخير',
        afternoon: 'مساء الخير',
        evening: 'مساء الخير',
        night: 'تصبح على خير'
      },
      
      // Language
      language: {
        current: 'اللغة الحالية',
        selectLanguage: 'اختر اللغة'
      },
      
      // SuperDuperHome
      superDuperHome: {
        searchPlaceholder: 'البحث عن كعكات رائعة...',
        loadingCakes: 'جاري تحميل الكعكات الرائعة...',
        
        // Quick Actions
        quickActions: {
          aiGenerate: 'إنشاء بالذكاء الاصطناعي',
          scanQr: 'مسح QR',
          custom: 'مخصص'
        },
        
        // Categories
        categories: {
          title: 'الفئات',
          seeAll: 'جميع الفئات'
        },
        
        // Featured
        featured: {
          title: 'الكعكات المميزة',
          seeAll: 'عرض الكل'
        },
        
        // Gallery
        gallery: {
          viewDesign: 'عرض التصميم',
          designDescription: 'تصميم كعكة جميل للإلهام'
        },
        
        // Cakes
        cakes: {
          defaultName: 'كعكة لذيذة'
        }
      }
    }
  }
};

// ================================
// SIMPLE LANGUAGE DETECTOR (NO RNLOCALIZE!)
// ================================

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        console.log('🌐 i18n: Using saved language:', savedLanguage);
        callback(savedLanguage);
        return;
      }
      
      // Default to English if no saved language
      console.log('🌐 i18n: Using default language: en');
      callback('en');
    } catch (error) {
      console.error('❌ i18n: Language detection failed:', error);
      callback('en'); // Fallback to English
    }
  },
  init: () => {
    console.log('🌐 i18n: Language detector initialized (no RNLocalize)');
  },
  cacheUserLanguage: async (lng) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', lng);
      console.log('🌐 i18n: Language cached:', lng);
    } catch (error) {
      console.error('❌ i18n: Failed to cache language:', error);
    }
  }
};

// ================================
// I18N INITIALIZATION (CLEAN!)
// ================================

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__, // Enable debug in development
    
    // Cache
    saveMissing: false,
    
    // Interpolation
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // React specific
    react: {
      useSuspense: false, // Disable suspense for React Native
    }
  });

// Log successful initialization
console.log('🎯 Communication #60.10: i18n initialized WITHOUT RNLocalize dependencies');

export default i18n;