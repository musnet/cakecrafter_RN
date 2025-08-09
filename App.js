// App.js - Communication #60.7: PRODUCTION VERSION without Polyfill Dependencies
// 🎯 FINAL: This version removes polyfill imports and relies on Expo's built-in Intl support
// 🛒 CART: Complete CartProvider integration with enterprise-grade state management
// 🌐 i18n: Clean internationalization setup WITHOUT external polyfill dependencies
// ⚡ PERFORMANCE: Optimized provider hierarchy and error boundary protection
// 🇶🇦 QATAR: Full Arabic/English support with proper RTL handling
// 📱 EXPO: Fully compatible with Expo managed workflow

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
  Platform,
} from 'react-native';

// Import i18n FIRST (very important!) - CLEAN VERSION WITHOUT RNLocalize OR Polyfills
import './src/i18n';
import { useTranslation } from 'react-i18next';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ================================
// ✨ CART PROVIDER INTEGRATION - Communication #60.7
// ================================
import { CartProvider } from './src/context/CartContext';

// Import screens and components
import LanguageSwitcher from './src/components/LanguageSwitcher';
import SuperDuperHomeScreen from './src/screens/SuperDuperHomeScreen';
import { ApiService } from './src/services/ApiService';

// Create Stack Navigator
const Stack = createStackNavigator();

// ================================
// ERROR BOUNDARY FOR CART INTEGRATION - Communication #60.7
// ================================
class CartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Communication #60.7 - Cart Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Cart System Error</Text>
          <Text style={styles.errorMessage}>
            Communication #60.7: There was an issue with the cart system.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// ================================
// ENHANCED WELCOME SCREEN WITH CART INTEGRATION - Communication #60.7
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
    console.log('🌐 Communication #60.7 - Language changed to:', languageCode);
    
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

  // Navigate to SuperDuperHomeScreen with cart support
  const handleGetStarted = () => {
    console.log('🚀 Communication #60.7 - Navigating to SuperDuperHomeScreen with FULL CART SUPPORT (No Polyfills)');
    navigation.navigate('SuperDuperHome');
  };

  // Database health check handler
  const handleDatabaseHealthCheck = async () => {
    try {
      setIsCheckingHealth(true);
      setHealthStatus(null);
      
      console.log('🏥 Communication #60.7 - Starting database health check...');
      
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
      console.error('❌ Communication #60.7 - Database health check error:', error);
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
            ? 'تجربة التسوق الكاملة مع السلة والدفع'
            : 'Complete shopping experience with cart & checkout'
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

        {/* Get Started Button - NOW WITH FULL CART SUPPORT */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>
            🛒 Explore Cakes & Shopping Cart
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <Text style={styles.infoText}>
          {currentLanguage === 'ar' 
            ? 'تجربة كاملة للتسوق مع السلة وإدارة الطلبات'
            : 'Full shopping experience with cart & order management'
          }
        </Text>
        
        {/* ✅ EXPO COMPATIBLE NOTICE */}
        <View style={styles.productionNotice}>
          <Text style={styles.productionNoticeText}>
            ✅ Communication #60.7: EXPO COMPATIBLE - No external polyfill dependencies!
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
// MAIN APP COMPONENT WITH COMPLETE PROVIDER HIERARCHY - Communication #60.7
// ================================
const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Communication #60.7 - Initializing Expo-compatible app with cart integration (no polyfills)...');
        
        // Basic Intl support check (non-blocking)
        try {
          if (typeof Intl !== 'undefined') {
            console.log('✅ Communication #60.7 - Native Intl support detected');
          } else {
            console.log('⚠️ Communication #60.7 - Limited Intl support, using fallbacks');
          }
        } catch (intlError) {
          console.warn('⚠️ Communication #60.7 - Intl check warning (non-blocking):', intlError);
        }
        
        // Simulate initialization delay for proper provider setup
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ Communication #60.7 - App initialization complete with cart system ready (Expo compatible)');
        setIsInitializing(false);
        
      } catch (error) {
        console.error('❌ Communication #60.7 - App initialization failed:', error);
        setInitError(error);
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Loading screen during initialization
  if (isInitializing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B1538" />
        <Text style={styles.loadingText}>
          Communication #60.7: Initializing cart system...
        </Text>
      </SafeAreaView>
    );
  }

  // Error screen if initialization failed
  if (initError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>❌ Initialization Error</Text>
        <Text style={styles.errorMessage}>
          Communication #60.7: Failed to initialize app. Please restart.
        </Text>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // EXPO-COMPATIBLE APP WITH COMPLETE PROVIDER HIERARCHY - Communication #60.7
  // ============================================================================
  
  return (
    <CartErrorBoundary>
      <CartProvider>
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
      </CartProvider>
    </CartErrorBoundary>
  );
};

// ================================
// STYLES - Communication #60.7
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
  
  // ✅ EXPO COMPATIBLE NOTICE
  productionNotice: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    maxWidth: '90%',
  },
  
  productionNoticeText: {
    fontSize: 12,
    color: '#155724',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Loading & Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#8B1538',
    marginTop: 16,
    textAlign: 'center',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  errorMessage: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  
  errorButton: {
    backgroundColor: '#8B1538',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;