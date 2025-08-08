// App.js - Communication #64.9: Updated with React Navigation
// Navigation setup for SuperDuperHomeScreen with language switcher integration

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Import i18n FIRST (very important!)
import './src/i18n';
import { useTranslation } from 'react-i18next';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LanguageSwitcher from './src/components/LanguageSwitcher';
import SuperDuperHomeScreen from './src/screens/SuperDuperHomeScreen';

// Create Stack Navigator
const Stack = createStackNavigator();

// ================================
// WELCOME/TEST SCREEN COMPONENT
// ================================
const WelcomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

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
        <Text style={styles.headerSubtitle}>Language Test & Navigation</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Current Language Display */}
        <View style={styles.languageDisplay}>
          <Text style={styles.currentLanguageLabel}>
            {t('language.current', 'Current Language')}:
          </Text>
          <Text style={styles.currentLanguageValue}>
            {currentLanguage === 'ar' ? '🇶🇦 العربية' : '🇺🇸 English'}
          </Text>
        </View>

        {/* Test Text with Translations */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>
            {t('app.title', 'CakeCrafter.AI')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t('app.subtitle', 'AI-Powered Cake Design Platform')}
          </Text>
          <Text style={styles.sectionDescription}>
            {t('app.description', 'Create stunning custom cakes with the power of artificial intelligence')}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Language Switcher Button */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageSwitcher(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageButtonText}>
              {t('language.choose', 'Choose Language')} 🌐
            </Text>
          </TouchableOpacity>

          {/* Get Started Button - Navigates to SuperDuperHomeScreen */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={styles.getStartedButtonText}>
              {t('app.getStarted', 'Get Started')} 🚀
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Info */}
        <View style={styles.navigationInfo}>
          <Text style={styles.navigationTitle}>
            {currentLanguage === 'ar' ? 'معلومات التنقل' : 'Navigation Info'}
          </Text>
          <Text style={styles.navigationText}>
            {currentLanguage === 'ar' 
              ? 'اضغط "ابدأ الآن" للانتقال إلى الشاشة الرئيسية المتقدمة'
              : 'Tap "Get Started" to navigate to SuperDuperHomeScreen'
            }
          </Text>
        </View>

        {/* Debug Info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text style={styles.debugText}>Language: {currentLanguage}</Text>
          <Text style={styles.debugText}>Direction: {currentLanguage === 'ar' ? 'RTL' : 'LTR'}</Text>
          <Text style={styles.debugText}>i18n Ready: {i18n.isInitialized ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>Navigation: React Navigation v6</Text>
        </View>
      </View>

      {/* LanguageSwitcher Modal */}
      <LanguageSwitcher
        visible={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
      />
    </SafeAreaView>
  );
};

// ================================
// MAIN APP COMPONENT WITH NAVIGATION
// ================================
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // Hide default navigation header
          cardStyle: { backgroundColor: '#F8F9FA' },
          animationEnabled: true,
          animationTypeForReplace: 'push',
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{
            title: 'CakeCrafter.AI Welcome',
          }}
        />
        <Stack.Screen 
          name="SuperDuperHome" 
          component={SuperDuperHomeScreen}
          options={{
            title: 'CakeCrafter.AI Home',
            gestureEnabled: true,
          }}
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
    backgroundColor: '#8B1538',
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  languageDisplay: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#8B1538',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentLanguageLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  currentLanguageValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B1538',
  },
  testSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#8B1538',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: 24,
  },
  languageButton: {
    backgroundColor: '#8B1538',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#8B1538',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#28A745',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#28A745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationInfo: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  navigationText: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
  },
  debugInfo: {
    backgroundColor: '#2C3E50',
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto',
  },
  debugTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginBottom: 2,
    fontFamily: 'monospace',
  },
});

export default App;