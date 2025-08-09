// App.js - Communication #60.8: TEMPORARY ORIGINAL VERSION (Fix Import Errors)
// Navigation setup for SuperDuperHomeScreen with CLEAN language switching + Database Health Check
// ⚠️ TEMPORARY: This is the original App.js WITHOUT cart integration to fix current errors
// 🔧 STEP: Use this temporarily while copying cart component contents, then switch to cart version

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Import i18n FIRST (very important!) - CLEAN VERSION
import './src/i18n';
import { useTranslation } from 'react-i18next';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens and services
import LanguageSwitcher from './src/components/LanguageSwitcher';
import SuperDuperHomeScreen from './src/screens/SuperDuperHomeScreen';
import { ApiService } from './src/services/ApiService';

// Create Stack Navigator
const Stack = createStackNavigator();

// ================================
// WELCOME/TEST SCREEN COMPONENT
// ================================
const WelcomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Database health check state
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    console.log('🌐 Welcome: Language changed to:', languageCode);
    
    // Show confirmation alert
    setTimeout(() => {
      Alert.alert(
        languageCode === 'ar' ? 'تم تغيير اللغة' : 'Language Changed',
        languageCode === 'ar' 
          ? `تم تغيير اللغة إلى ${languageCode === 'ar' ? 'العربية' : 'الإنجليزية'}`
          : `Language changed to ${languageCode === 'ar' ? 'Arabic' : 'English'}`,
        [{ text: languageCode === 'ar' ? 'موافق' : 'OK' }]
      );
    }, 500);
  };

  // Navigate to SuperDuperHomeScreen
  const handleGetStarted = () => {
    console.log('🚀 Navigation: Navigating to SuperDuperHomeScreen');
    navigation.navigate('SuperDuperHome');
  };

  // Database health check handler
  const handleDatabaseHealthCheck = async () => {
    try {
      setIsCheckingHealth(true);
      setHealthStatus(null);
      
      console.log('🏥 Welcome: Starting database health check...');
      
      const healthResult = await ApiService.checkDatabaseHealth();
      
      setHealthStatus(healthResult);
      
      // Show result alert
      const isConnected = healthResult.connected;
      const title = isConnected ? 
        (currentLanguage === 'ar' ? 'قاعدة البيانات متصلة' : 'Database Connected') :
        (currentLanguage === 'ar' ? 'خطأ في الاتصال' : 'Connection Error');
      
      const message = isConnected ?
        (currentLanguage === 'ar' ? 'قاعدة البيانات تعمل بشكل طبيعي' : 'Database is working normally') :
        (currentLanguage === 'ar' ? 'فشل الاتصال بقاعدة البيانات' : 'Failed to connect to database');
      
      Alert.alert(title, message, [
        { text: currentLanguage === 'ar' ? 'موافق' : 'OK' }
      ]);
      
    } catch (error) {
      console.error('❌ Welcome: Database health check error:', error);
      setHealthStatus({ connected: false, error: error.message });
      
      Alert.alert(
        currentLanguage === 'ar' ? 'خطأ' : 'Error',
        currentLanguage === 'ar' ? 'حدث خطأ أثناء فحص قاعدة البيانات' : 'An error occurred during database check',
        [{ text: currentLanguage === 'ar' ? 'موافق' : 'OK' }]
      );
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B1538" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentLanguage === 'ar' ? 'صانع الكيك.آي' : 'CakeCrafter.AI'}
        </Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageSwitcher(true)}
        >
          <Text style={styles.languageButtonText}>
            {currentLanguage === 'ar' ? '🇶🇦 عربي' : '🇬🇧 English'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>
          {currentLanguage === 'ar' ? 'مرحباً بك!' : 'Welcome!'}
        </Text>
        
        <Text style={styles.welcomeSubtitle}>
          {currentLanguage === 'ar' 
            ? 'تجربة التسوق المحسنة - قيد التطوير'
            : 'Enhanced shopping experience - Under Development'
          }
        </Text>

        {/* Database Health Check Button */}
        <TouchableOpacity
          style={styles.healthButton}
          onPress={handleDatabaseHealthCheck}
          disabled={isCheckingHealth}
        >
          <View style={styles.healthButtonContent}>
            {isCheckingHealth ? (
              <ActivityIndicator size="small" color="#8B1538" />
            ) : (
              <Text style={styles.healthButtonIcon}>🏥</Text>
            )}
            <Text style={styles.healthButtonText}>
              {isCheckingHealth ? 
                (currentLanguage === 'ar' ? 'جاري فحص قاعدة البيانات...' : 'Checking Database...') :
                (currentLanguage === 'ar' ? 'فحص قاعدة البيانات' : 'Check Database Health')
              }
            </Text>
          </View>
          
          {/* Health Status Indicator */}
          {healthStatus && !isCheckingHealth && (
            <View style={[styles.healthStatusIndicator, 
              healthStatus.connected ? styles.healthStatusConnected : styles.healthStatusError
            ]}>
              <Text style={styles.healthStatusText}>
                {healthStatus.connected ? '✅' : '❌'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>
            🍰 Test Categories & Basic Features
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <Text style={styles.infoText}>
          {currentLanguage === 'ar' 
            ? 'اختبار التمرير الأفقي للفئات + أساسيات التطبيق'
            : 'Testing horizontal categories scrolling + app basics'
          }
        </Text>
        
        {/* ⚠️ TEMPORARY NOTICE */}
        <View style={styles.tempNotice}>
          <Text style={styles.tempNoticeText}>
            ⚠️ TEMPORARY VERSION - Cart features disabled until components are ready
          </Text>
        </View>
      </View>

      {/* Language Switcher Modal */}
      <LanguageSwitcher
        visible={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
      />
    </SafeAreaView>
  );
};

// ================================
// MAIN APP COMPONENT (TEMPORARY - NO CART)
// ================================
const App = () => {
  console.log('🚀 Communication #60.8 - App starting with TEMPORARY version (no cart to fix errors)');

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="SuperDuperHome" 
          component={SuperDuperHomeScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ================================
// STYLES
// ================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#8B1538',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Database Health Check Styles
  healthButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 250,
    borderWidth: 2,
    borderColor: '#8B1538',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  
  healthButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  healthButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  
  healthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B1538',
    textAlign: 'center',
  },
  
  healthStatusIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  healthStatusConnected: {
    backgroundColor: '#4CAF50',
  },
  
  healthStatusError: {
    backgroundColor: '#F44336',
  },
  
  healthStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Get Started Button
  getStartedButton: {
    backgroundColor: '#8B1538',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#8B1538',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  
  // ⚠️ TEMPORARY NOTICE
  tempNotice: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    maxWidth: '90%',
  },
  
  tempNoticeText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default App;