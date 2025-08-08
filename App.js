// App.js - Communication #60.13: Enhanced with Database Health Check Button
// Navigation setup for SuperDuperHomeScreen with CLEAN language switching + Database Health Check
// ✨ ENHANCED: Added database health check button while preserving ALL existing functionality

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
import { ApiService } from './src/services/ApiService'; // ✨ NEW: Import enhanced ApiService

// Create Stack Navigator
const Stack = createStackNavigator();

// ================================
// WELCOME/TEST SCREEN COMPONENT
// ================================
const WelcomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // ✨ NEW: Database health check state - Communication #60.13
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

  // ✨ NEW: Database health check handler - Communication #60.13
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
        (currentLanguage === 'ar' ? 'متصل بقاعدة البيانات' : 'Database Connected') :
        (currentLanguage === 'ar' ? 'خطأ في الاتصال' : 'Connection Error');
      
      const message = isConnected ? 
        `✅ ${healthResult.service}\nAPI: ${healthResult.apiVersion}\nStatus: ${healthResult.status}` :
        `❌ ${healthResult.error || 'Unable to connect to database'}`;
      
      Alert.alert(title, message, [
        { text: currentLanguage === 'ar' ? 'موافق' : 'OK' }
      ]);
      
    } catch (error) {
      console.error('❌ Health check error:', error);
      setHealthStatus({ connected: false, error: error.message });
      
      Alert.alert(
        currentLanguage === 'ar' ? 'خطأ في الاتصال' : 'Connection Error',
        `❌ ${error.message}`,
        [{ text: currentLanguage === 'ar' ? 'موافق' : 'OK' }]
      );
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Update current language when i18n changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F9FA"
        translucent={false}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CakeCrafter.AI</Text>
        <Text style={styles.headerSubtitle}>Categories Testing + Database Health Check</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Current Language Display */}
        <View style={styles.languageDisplay}>
          <Text style={styles.currentLanguageLabel}>
            {t('language.current', 'Current Language')}:
          </Text>
          <Text style={styles.currentLanguageValue}>
            {currentLanguage === 'ar' ? 'العربية (Arabic)' : 'English'}
          </Text>
        </View>

        {/* Language Switcher Button */}
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageSwitcher(true)}
        >
          <Text style={styles.languageButtonText}>
            {t('language.selectLanguage', 'Change Language')}
          </Text>
        </TouchableOpacity>

        {/* ✨ NEW: Database Health Check Button - Communication #60.13 */}
        <TouchableOpacity
          style={[styles.healthButton, isCheckingHealth && styles.healthButtonDisabled]}
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
            🍰 Test Categories Scrolling
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <Text style={styles.infoText}>
          {currentLanguage === 'ar' 
            ? 'اختبار التمرير الأفقي للفئات + فحص قاعدة البيانات'
            : 'Testing horizontal categories scrolling + database connectivity'
          }
        </Text>
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
// MAIN APP COMPONENT
// ================================
const App = () => {
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
// STYLES (ENHANCED) - Communication #60.13
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
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
  },
  
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  languageDisplay: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  currentLanguageLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  
  currentLanguageValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1538',
  },
  
  languageButton: {
    backgroundColor: '#8B1538',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // ✨ NEW: Health Check Button Styles - Communication #60.13
  healthButton: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    position: 'relative',
    minWidth: 250,
  },
  
  healthButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
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
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  healthStatusIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  healthStatusConnected: {
    backgroundColor: '#4CAF50',
  },
  
  healthStatusError: {
    backgroundColor: '#F44336',
  },
  
  healthStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  
  getStartedButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 20,
  },
  
  getStartedText: {
    color: '#8B1538',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default App;
