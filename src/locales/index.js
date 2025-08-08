// src/locales/index.js - Communication #63.1: i18n Configuration
// Comprehensive Arabic/English language support with RTL and cultural adaptations

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import translation files
import en from './en.json';
import ar from './ar.json';

// Language storage key
const LANGUAGE_STORAGE_KEY = 'user_language_preference';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇶🇦',
    direction: 'rtl',
  },
};

// Custom language detector for React Native
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // First, check if user has saved a preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
        console.log('🌐 Using saved language preference:', savedLanguage);
        callback(savedLanguage);
        return;
      }

      // If no saved preference, detect from device
      const deviceLocales = getLocales();
      console.log('📱 Device locales:', deviceLocales);

      // Check if device language is supported
      for (const locale of deviceLocales) {
        const languageCode = locale.languageCode;
        if (SUPPORTED_LANGUAGES[languageCode]) {
          console.log('🌐 Using device language:', languageCode);
          callback(languageCode);
          return;
        }
      }

      // Default to English if no match
      console.log('🌐 Using default language: en');
      callback('en');
    } catch (error) {
      console.error('❌ Language detection error:', error);
      callback('en'); // Fallback to English
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      console.log('💾 Language preference saved:', language);
    } catch (error) {
      console.error('❌ Failed to save language preference:', error);
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    // Translation resources
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },

    // Language settings
    fallbackLng: 'en',
    debug: __DEV__, // Enable debug in development

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value, format, lng) => {
        // Custom formatting for currency, dates, etc.
        if (format === 'currency') {
          const isArabic = lng === 'ar';
          const currency = isArabic ? 'ريال قطري' : 'QAR';
          return `${value} ${currency}`;
        }
        if (format === 'number') {
          // Use Arabic-Indic numerals for Arabic
          if (lng === 'ar') {
            return value.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
          }
        }
        return value;
      },
    },

    // React i18next specific options
    react: {
      useSuspense: false, // We'll handle loading ourselves
    },

    // Additional options
    compatibilityJSON: 'v3', // Use v3 format for better compatibility
  });

// ============================================================================
// LANGUAGE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Change the app language and update RTL direction
 * @param {string} languageCode - Language code ('en' or 'ar')
 */
export const changeLanguage = async (languageCode) => {
  try {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      throw new Error(`Unsupported language: ${languageCode}`);
    }

    console.log('🔄 Changing language to:', languageCode);

    // Change i18n language
    await i18n.changeLanguage(languageCode);

    // Update RTL direction
    const isRTL = SUPPORTED_LANGUAGES[languageCode].direction === 'rtl';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      
      // Note: In production, you might want to restart the app for RTL changes
      console.log(`📱 RTL direction set to: ${isRTL}`);
    }

    // Save preference
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

    console.log('✅ Language changed successfully to:', languageCode);
    return true;
  } catch (error) {
    console.error('❌ Failed to change language:', error);
    return false;
  }
};

/**
 * Get current language information
 * @returns {object} Current language object
 */
export const getCurrentLanguage = () => {
  const currentLang = i18n.language || 'en';
  return SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
};

/**
 * Check if current language is RTL
 * @returns {boolean} True if current language is RTL
 */
export const isRTL = () => {
  return getCurrentLanguage().direction === 'rtl';
};

/**
 * Get opposite language code
 * @returns {string} Opposite language code
 */
export const getOppositeLanguage = () => {
  const currentLang = i18n.language || 'en';
  return currentLang === 'en' ? 'ar' : 'en';
};

/**
 * Format currency for current language
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const currentLang = getCurrentLanguage();
  if (currentLang.code === 'ar') {
    // Arabic format: ١٢٣ ريال قطري
    const arabicAmount = amount.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
    return `${arabicAmount} ريال قطري`;
  } else {
    // English format: 123 QAR
    return `${amount} QAR`;
  }
};

/**
 * Get greeting based on time of day and language
 * @returns {string} Appropriate greeting
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  const currentLang = getCurrentLanguage().code;
  
  if (currentLang === 'ar') {
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  } else {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
};

// ============================================================================
// CULTURAL ADAPTATIONS
// ============================================================================

/**
 * Qatar-specific cultural features
 */
export const QatarCulturalFeatures = {
  /**
   * Check if current time is prayer time (placeholder)
   * @returns {boolean} True if it's prayer time
   */
  isPrayerTime: () => {
    // TODO: Implement actual prayer time detection
    return false;
  },

  /**
   * Get Hijri date for current date (placeholder)
   * @returns {string} Hijri date string
   */
  getHijriDate: () => {
    // TODO: Implement Hijri calendar integration
    return '';
  },

  /**
   * Check if it's Ramadan (placeholder)
   * @returns {boolean} True if it's Ramadan
   */
  isRamadan: () => {
    // TODO: Implement Ramadan detection
    return false;
  },
};

// ============================================================================
// EXPORT
// ============================================================================

export default i18n;
