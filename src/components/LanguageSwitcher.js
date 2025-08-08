// src/components/LanguageSwitcher.js - Communication #64.2: Language Switcher Component
// Qatar-branded bilingual language switcher with RTL support and smooth animations

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  I18nManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import RNLocalize from 'react-native-localize';

const { width, height } = Dimensions.get('window');

// ================================
// QATAR BRANDING COLORS
// ================================
const COLORS = {
  // Qatar Official Colors
  qatarMaroon: '#8B1538',
  qatarWhite: '#FFFFFF',
  qatarGold: '#FFD700',
  
  // Supporting Colors
  darkBackground: '#1A1A2E',
  lightBackground: '#F8F9FA',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  shadowColor: 'rgba(139, 21, 56, 0.3)',
  overlayColor: 'rgba(0, 0, 0, 0.7)',
  
  // Text Colors
  primaryText: '#2C3E50',
  secondaryText: '#7F8C8D',
  arabicText: '#2C3E50',
  
  // Interactive States
  pressedState: '#6B1028',
  selectedBorder: '#8B1538',
  unselectedBorder: '#E0E0E0',
};

// ================================
// LANGUAGE OPTIONS DATA
// ================================
const LANGUAGE_OPTIONS = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    subtitle: 'International',
    subtitleArabic: 'دولي',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇶🇦',
    direction: 'rtl',
    subtitle: 'Qatar',
    subtitleArabic: 'قطر',
  },
];

// ================================
// LANGUAGE SWITCHER COMPONENT
// ================================
const LanguageSwitcher = ({ 
  visible = false, 
  onClose = () => {}, 
  onLanguageChange = () => {},
  showAsButton = false,
  compact = false 
}) => {
  // ================================
  // HOOKS & STATE
  // ================================
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isVisible, setIsVisible] = useState(visible);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [deviceLanguage, setDeviceLanguage] = useState('en');

  // Animation refs
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  // ================================
  // DEVICE LANGUAGE DETECTION
  // ================================
  useEffect(() => {
    detectDeviceLanguage();
    loadSavedLanguage();
  }, []);

  const detectDeviceLanguage = () => {
    try {
      const locales = RNLocalize.getLocales();
      if (locales.length > 0) {
        const primaryLocale = locales[0];
        const detectedLang = primaryLocale.languageCode === 'ar' ? 'ar' : 'en';
        setDeviceLanguage(detectedLang);
        console.log('📱 Communication #64.2:1 - Device language detected:', detectedLang);
      }
    } catch (error) {
      console.log('⚠️ Communication #64.2:1 - Device language detection failed:', error);
      setDeviceLanguage('en'); // Fallback to English
    }
  };

  // ================================
  // LANGUAGE PERSISTENCE
  // ================================
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setCurrentLanguage(savedLanguage);
        await changeLanguage(savedLanguage, false);
        console.log('💾 Communication #64.2:2 - Loaded saved language:', savedLanguage);
      } else {
        // Use device language if no saved preference
        setCurrentLanguage(deviceLanguage);
        await changeLanguage(deviceLanguage, false);
      }
    } catch (error) {
      console.log('⚠️ Communication #64.2:2 - Failed to load saved language:', error);
    }
  };

  const saveLanguagePreference = async (languageCode) => {
    try {
      await AsyncStorage.setItem('user_language', languageCode);
      console.log('💾 Communication #64.2:3 - Saved language preference:', languageCode);
    } catch (error) {
      console.log('⚠️ Communication #64.2:3 - Failed to save language:', error);
    }
  };

  // ================================
  // LANGUAGE CHANGE HANDLER
  // ================================
  const changeLanguage = async (languageCode, showTransition = true) => {
    if (languageCode === currentLanguage) return;

    try {
      if (showTransition) {
        setIsTransitioning(true);
      }

      // Update i18n language
      await i18n.changeLanguage(languageCode);
      
      // Update RTL/LTR direction
      const isRTL = languageCode === 'ar';
      if (Platform.OS !== 'web') {
        I18nManager.forceRTL(isRTL);
        if (I18nManager.isRTL !== isRTL) {
          Alert.alert(
            isRTL ? 'إعادة تشغيل مطلوبة' : 'Restart Required',
            isRTL 
              ? 'لتطبيق تغيير اللغة بالكامل، يرجى إعادة تشغيل التطبيق.'
              : 'To fully apply the language change, please restart the app.',
            [
              {
                text: isRTL ? 'موافق' : 'OK',
                onPress: () => {},
              }
            ]
          );
        }
      }

      // Update state and save preference
      setCurrentLanguage(languageCode);
      await saveLanguagePreference(languageCode);

      // Notify parent component
      onLanguageChange(languageCode);

      console.log('🌐 Communication #64.2:4 - Language changed to:', languageCode);

      if (showTransition) {
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }

    } catch (error) {
      console.log('⚠️ Communication #64.2:4 - Language change failed:', error);
      if (showTransition) {
        setIsTransitioning(false);
      }
    }
  };

  // ================================
  // ANIMATION HANDLERS
  // ================================
  const showModal = () => {
    setIsVisible(true);
    Animated.parallel([
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onClose();
    });
  };

  // Update visibility when prop changes
  useEffect(() => {
    if (visible && !isVisible) {
      showModal();
    } else if (!visible && isVisible) {
      hideModal();
    }
  }, [visible]);

  // ================================
  // LANGUAGE OPTION RENDERER
  // ================================
  const renderLanguageOption = (option, index) => {
    const isSelected = currentLanguage === option.code;
    const isRTL = option.direction === 'rtl';
    const currentIsArabic = currentLanguage === 'ar';

    return (
      <TouchableOpacity
        key={option.code}
        style={[
          styles.languageOption,
          isSelected && styles.selectedOption,
          { writingDirection: isRTL ? 'rtl' : 'ltr' }
        ]}
        onPress={() => {
          changeLanguage(option.code);
          setTimeout(hideModal, 600);
        }}
        activeOpacity={0.7}
        disabled={isTransitioning}
      >
        <View style={[styles.optionContent, isRTL && styles.optionContentRTL]}>
          {/* Flag */}
          <Text style={styles.flagEmoji}>{option.flag}</Text>
          
          {/* Language Info */}
          <View style={[styles.languageInfo, isRTL && styles.languageInfoRTL]}>
            <Text style={[
              styles.languageName,
              isSelected && styles.selectedLanguageName,
              isRTL && styles.arabicText
            ]}>
              {option.nativeName}
            </Text>
            <Text style={[
              styles.languageSubtitle,
              isSelected && styles.selectedLanguageSubtitle,
              isRTL && styles.arabicText
            ]}>
              {currentIsArabic ? option.subtitleArabic : option.subtitle}
            </Text>
          </View>

          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>

        {/* Progress Bar for Transitioning */}
        {isTransitioning && isSelected && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ================================
  // COMPACT BUTTON RENDERER
  // ================================
  const renderCompactButton = () => {
    const currentOption = LANGUAGE_OPTIONS.find(opt => opt.code === currentLanguage);
    
    return (
      <TouchableOpacity
        style={styles.compactButton}
        onPress={showModal}
        activeOpacity={0.7}
      >
        <Text style={styles.compactFlag}>{currentOption?.flag}</Text>
        <Text style={styles.compactText}>{currentOption?.nativeName}</Text>
      </TouchableOpacity>
    );
  };

  // ================================
  // MAIN RENDER
  // ================================
  if (showAsButton || compact) {
    return renderCompactButton();
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={hideModal}
      statusBarTranslucent={true}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: modalAnimation,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={hideModal}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnimation },
                { scale: scaleAnimation }
              ],
              opacity: fadeAnimation,
            }
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentLanguage === 'ar' ? 'اختر اللغة' : 'Choose Language'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {currentLanguage === 'ar' 
                ? 'اختر لغتك المفضلة لتجربة مخصصة' 
                : 'Select your preferred language for a personalized experience'
              }
            </Text>
          </View>

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            {LANGUAGE_OPTIONS.map((option, index) => 
              renderLanguageOption(option, index)
            )}
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            {isTransitioning ? (
              <View style={styles.transitionContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.transitionText}>
                  {currentLanguage === 'ar' ? 'جاري التحديث...' : 'Updating...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.footerText}>
                Powered by CakeCrafter.AI Qatar
              </Text>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ================================
// STYLES
// ================================
const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    maxWidth: width * 0.9,
    width: '100%',
    maxHeight: height * 0.8,
    elevation: 10,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  // Header Styles
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.qatarMaroon,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Options Container
  optionsContainer: {
    marginBottom: 24,
  },

  // Language Option Styles
  languageOption: {
    backgroundColor: COLORS.qatarWhite,
    borderRadius: 16,
    marginBottom: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.unselectedBorder,
    elevation: 2,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: COLORS.selectedBorder,
    backgroundColor: `${COLORS.qatarMaroon}08`,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContentRTL: {
    flexDirection: 'row-reverse',
  },

  // Flag and Text Styles
  flagEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
    marginLeft: 4,
  },
  languageInfoRTL: {
    marginLeft: 0,
    marginRight: 20,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: COLORS.qatarMaroon,
  },
  languageSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  selectedLanguageSubtitle: {
    color: COLORS.qatarMaroon,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  // Selection Indicator
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.qatarMaroon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.qatarWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Progress Styles
  progressContainer: {
    marginTop: 12,
    height: 3,
    backgroundColor: `${COLORS.qatarMaroon}20`,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.qatarMaroon,
    width: '100%',
  },

  // Footer Styles
  modalFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.secondaryText}20`,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  transitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.qatarMaroon,
    borderTopColor: 'transparent',
    marginRight: 8,
  },
  transitionText: {
    fontSize: 14,
    color: COLORS.qatarMaroon,
    fontWeight: '500',
  },

  // Compact Button Styles
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.qatarWhite,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.qatarMaroon,
    elevation: 2,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  compactText: {
    fontSize: 14,
    color: COLORS.qatarMaroon,
    fontWeight: '500',
  },
});

export default LanguageSwitcher;
