// src/components/LanguageSwitcher.js - Communication #60.3: Temporary Fix (No Native Dependencies)
// Qatar-branded bilingual language switcher with RTL support and smooth animations
// ⚡ TEMPORARY: Removed react-native-localize dependency for immediate testing

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
  const [isChanging, setIsChanging] = useState(false);
  
  // Animation values
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  // ================================
  // EFFECTS
  // ================================
  
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);
  
  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);
  
  // ================================
  // ANIMATION FUNCTIONS
  // ================================
  
  const showModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const hideModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // ================================
  // LANGUAGE CHANGE FUNCTIONS
  // ================================
  
  const handleLanguageSelect = async (languageCode) => {
    if (languageCode === currentLanguage || isChanging) return;
    
    try {
      setIsChanging(true);
      console.log('🌐 LanguageSwitcher: Changing language to:', languageCode);
      
      // Change i18n language
      await i18n.changeLanguage(languageCode);
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('selectedLanguage', languageCode);
      
      // Update RTL for Arabic
      const isRTL = languageCode === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        
        // Show restart alert for RTL changes
        Alert.alert(
          languageCode === 'ar' ? 'إعادة تشغيل مطلوبة' : 'Restart Required',
          languageCode === 'ar' 
            ? 'يجب إعادة تشغيل التطبيق لتطبيق التغييرات'
            : 'Please restart the app to apply RTL changes',
          [
            { 
              text: languageCode === 'ar' ? 'موافق' : 'OK',
              onPress: () => {
                // In development, just continue
                setCurrentLanguage(languageCode);
                onLanguageChange(languageCode);
                onClose();
              }
            }
          ]
        );
      } else {
        setCurrentLanguage(languageCode);
        onLanguageChange(languageCode);
        onClose();
      }
      
    } catch (error) {
      console.error('❌ Language change failed:', error);
      Alert.alert(
        'Error',
        'Failed to change language. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsChanging(false);
    }
  };
  
  // ================================
  // RENDER FUNCTIONS
  // ================================
  
  const renderLanguageOption = (option) => {
    const isSelected = option.code === currentLanguage;
    const isArabic = option.code === 'ar';
    
    return (
      <TouchableOpacity
        key={option.code}
        style={[
          styles.languageOption,
          isSelected && styles.selectedOption,
          isArabic && styles.arabicOption,
        ]}
        onPress={() => handleLanguageSelect(option.code)}
        activeOpacity={0.7}
        disabled={isChanging}
      >
        <View style={styles.languageContent}>
          {/* Flag and Name */}
          <View style={styles.languageMain}>
            <Text style={styles.flagEmoji}>{option.flag}</Text>
            <View style={styles.languageText}>
              <Text style={[
                styles.languageName,
                isSelected && styles.selectedText,
                isArabic && styles.arabicText,
              ]}>
                {option.nativeName}
              </Text>
              <Text style={[
                styles.languageSubtitle,
                isSelected && styles.selectedSubtitle,
              ]}>
                {currentLanguage === 'ar' ? option.subtitleArabic : option.subtitle}
              </Text>
            </View>
          </View>
          
          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>
        
        {/* Loading indicator for changing language */}
        {isChanging && isSelected && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // ================================
  // MAIN RENDER
  // ================================
  
  if (showAsButton) {
    // Render as a simple button
    return (
      <TouchableOpacity
        style={[styles.buttonStyle, compact && styles.compactButton]}
        onPress={() => onLanguageChange && onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en')}
      >
        <Text style={styles.buttonText}>
          {currentLanguage === 'ar' ? '🇶🇦' : '🇺🇸'}
        </Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          { opacity: modalOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: modalScale },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <Text style={styles.modalTitle}>
                    {t('language.selectLanguage', 'Select Language')}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {currentLanguage === 'ar' ? 'اختر لغتك المفضلة' : 'Choose your preferred language'}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {/* Language Options */}
              <View style={styles.optionsContainer}>
                {LANGUAGE_OPTIONS.map(renderLanguageOption)}
              </View>
              
              {/* Footer */}
              <View style={styles.modalFooter}>
                <Text style={styles.footerText}>
                  🇶🇦 CakeCrafter.AI Qatar
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
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
  },
  
  overlayTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.8,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Header Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.unselectedBorder,
  },
  
  headerContent: {
    flex: 1,
  },
  
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  
  closeButtonText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
  },
  
  // Options Styles
  optionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  languageOption: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.unselectedBorder,
    backgroundColor: COLORS.qatarWhite,
    position: 'relative',
    overflow: 'hidden',
  },
  
  selectedOption: {
    borderColor: COLORS.selectedBorder,
    backgroundColor: COLORS.qatarMaroon + '10',
  },
  
  arabicOption: {
    // Additional styling for Arabic option if needed
  },
  
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  
  languageMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  flagEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  
  languageText: {
    flex: 1,
  },
  
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  
  arabicText: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
  },
  
  selectedText: {
    color: COLORS.qatarMaroon,
    fontWeight: 'bold',
  },
  
  languageSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  
  selectedSubtitle: {
    color: COLORS.qatarMaroon + 'CC',
  },
  
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.qatarMaroon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  checkmark: {
    color: COLORS.qatarWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  
  loadingText: {
    color: COLORS.qatarWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Footer Styles
  modalFooter: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.unselectedBorder,
  },
  
  footerText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  
  // Button Styles (for showAsButton mode)
  buttonStyle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightBackground,
    borderWidth: 1,
    borderColor: COLORS.unselectedBorder,
  },
  
  compactButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  
  buttonText: {
    fontSize: 16,
  },
});

export default LanguageSwitcher;
