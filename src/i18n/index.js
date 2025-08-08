// src/i18n/index.js - Communication #64.4: i18n Configuration
// React Native internationalization setup for Arabic/English support

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import ar from './locales/ar.json';

// Language detector configuration
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage) {
        console.log('🌐 i18n: Loaded saved language:', savedLanguage);
        callback(savedLanguage);
        return;
      }
      
      // Use device language as fallback
      const locales = RNLocalize.getLocales();
      const deviceLanguage = locales[0]?.languageCode || 'en';
      const supportedLanguage = deviceLanguage.includes('ar') ? 'ar' : 'en';
      
      console.log('📱 i18n: Detected device language:', supportedLanguage);
      callback(supportedLanguage);
    } catch (error) {
      console.log('⚠️ i18n: Language detection error:', error);
      callback('en'); // Fallback to English
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user_language', language);
      console.log('💾 i18n: Cached language:', language);
    } catch (error) {
      console.log('⚠️ i18n: Language caching error:', error);
    }
  },
};

// i18n configuration
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
    fallbackLng: 'en',
    debug: __DEV__, // Enable debug in development
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

console.log('🌐 i18n: Configuration initialized');

export default i18n;