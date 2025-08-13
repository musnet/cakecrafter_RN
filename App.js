// App.js - Communication #62.2: ENHANCED with AIStudioScreen Navigation
// 🤖 NEW: Added AIStudioScreen to navigation stack for AI cake generation
// 🎯 PRESERVED: CakeDetailScreen navigation from Communication #60.3
// 🛒 PRESERVED: Complete CartProvider integration with enterprise-grade state management
// 🌐 PRESERVED: Clean internationalization setup WITHOUT external polyfill dependencies
// ⚡ PRESERVED: Optimized provider hierarchy and error boundary protection
// 🇶🇦 PRESERVED: Full Arabic/English support with proper RTL handling
// 📱 PRESERVED: Fully compatible with Expo managed workflow
// 🍰 NAVIGATION: Welcome → SuperDuperHome → CakeDetail → AIStudio flow

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
//New
import AiStudioScreenLocal from './src/screens/AiStudioScreenLocal';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ================================
// ✨ CART PROVIDER INTEGRATION - Communication #60.3 (PRESERVED)
// ================================
import { CartProvider } from './src/context/CartContext';

// Import screens and components
import LanguageSwitcher from './src/components/LanguageSwitcher';
import SuperDuperHomeScreen from './src/screens/SuperDuperHomeScreen';
import CakeDetailScreen from './src/screens/CakeDetailScreen'; // ✨ PRESERVED - Communication #60.3
import AIStudioScreen from './src/screens/AIStudioScreen'; // ✨ NEW - Communication #62.2
import { ApiService } from './src/services/ApiService';

// Create Stack Navigator
const Stack = createStackNavigator();

// ================================
// ERROR BOUNDARY FOR CART INTEGRATION - Communication #60.3 (PRESERVED)
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
    console.error('🚨 Communication #62.2 - Cart Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Cart System Error</Text>
          <Text style={styles.errorMessage}>
            Communication #62.2: There was an issue with the cart system.
          </Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            <Text style={styles.restartButtonText}>🔄 Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// ================================
// WELCOME SCREEN - Communication #62.2 (PRESERVED)
// ================================
const WelcomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Communication #62.2 - Navigating to SuperDuperHome');
      
      // Simulate brief loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      navigation.replace('SuperDuperHome');
      
    } catch (error) {
      console.error('❌ Communication #62.2 - Navigation error:', error);
      Alert.alert(
        'Navigation Error',
        'Failed to navigate to main screen. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B1538" />
      
      <View style={styles.welcomeContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🎂</Text>
          <Text style={styles.appTitle}>CakeCrafter.AI</Text>
          <Text style={styles.appSubtitle}>
            {i18n.language === 'ar' ? 'صانع الكيك بالذكاء الاصطناعي' : 'AI-Powered Cake Design'}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>
            {i18n.language === 'ar' ? 'المميزات:' : 'Features:'}
          </Text>
          <Text style={styles.featureItem}>
            🤖 {i18n.language === 'ar' ? 'توليد الكيك بالذكاء الاصطناعي' : 'AI Cake Generation'}
          </Text>
          <Text style={styles.featureItem}>
            🛒 {i18n.language === 'ar' ? 'سلة التسوق المتقدمة' : 'Advanced Shopping Cart'}
          </Text>
          <Text style={styles.featureItem}>
            🇶🇦 {i18n.language === 'ar' ? 'تصميم قطري فاخر' : 'Qatar Luxury Design'}
          </Text>
          <Text style={styles.featureItem}>
            🌐 {i18n.language === 'ar' ? 'دعم العربية والإنجليزية' : 'Arabic & English Support'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonLoading]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>
              {i18n.language === 'ar' ? 'البدء 🚀' : 'Get Started 🚀'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ================================
// MAIN APP COMPONENT - Communication #62.2
// ================================
const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Communication #62.2 - Initializing CakeCrafter.AI with AI Studio');
        
        // Initialize services
        // await ApiService.initialize();
        
        // Simulate app loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ Communication #62.2 - App initialization complete with AI Studio support');
        setIsReady(true);
        
      } catch (error) {
        console.error('❌ Communication #62.2 - App initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🎂</Text>
          <Text style={styles.loadingText}>CakeCrafter.AI</Text>
          <ActivityIndicator size="large" color="#8B1538" style={styles.loadingSpinner} />
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // EXPO-COMPATIBLE APP WITH ENHANCED NAVIGATION STACK - Communication #62.2
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
            {/* ✨ PRESERVED: Cake Detail Screen - Communication #60.3 */}
            <Stack.Screen 
              name="CakeDetail" 
              component={CakeDetailScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}
            />
            {/* ✨ NEW: AI Studio Screen - Communication #62.2 */}
            <Stack.Screen 
              name="AIStudio" 
              component={AiStudioScreenLocal}
              options={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </CartErrorBoundary>
  );
};

// ================================
// STYLES - Communication #62.2 (ENHANCED FROM ORIGINAL)
// ================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B1538', // Qatar maroon
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B1538',
  },
  
  loadingEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  
  loadingSpinner: {
    marginTop: 20,
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  
  featureItem: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  continueButton: {
    backgroundColor: '#FFD700', // Qatar gold
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  
  continueButtonLoading: {
    backgroundColor: 'rgba(255, 215, 0, 0.7)',
  },
  
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B1538',
  },
  
  // Error Boundary Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B1538',
    paddingHorizontal: 20,
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  errorMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  
  restartButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  
  restartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B1538',
  },
});

export default App;