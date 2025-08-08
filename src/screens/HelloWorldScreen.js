// src/screens/HelloWorldScreen.js - Communication #61.4: CakeCrafter.AI Hello World
// Qatar-branded welcome screen with API connection test

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiService } from '../services/ApiService';
import { QatarColors, Spacing, Typography } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const HelloWorldScreen = ({ navigation }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [apiStatus, setApiStatus] = useState('checking'); // checking, connected, error
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  
  // ============================================================================
  // LIFECYCLE & EFFECTS
  // ============================================================================
  
  useEffect(() => {
    startAnimations();
    checkApiConnection();
  }, []);
  
  useEffect(() => {
    if (apiStatus === 'connected') {
      startPulseAnimation();
    }
  }, [apiStatus]);
  
  // ============================================================================
  // ANIMATIONS
  // ============================================================================
  
  const startAnimations = () => {
    // Logo scale animation
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Title fade in
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();
    
    // Button fade in
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 800,
      delay: 1200,
      useNativeDriver: true,
    }).start();
  };
  
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  // ============================================================================
  // API CONNECTION TEST
  // ============================================================================
  
  const checkApiConnection = async () => {
    try {
      setApiStatus('checking');
      console.log('🔍 Testing API connection to production backend...');
      
      const healthResponse = await ApiService.checkHealth();
      console.log('✅ API Health Check Success:', healthResponse);
      
      const infoResponse = await ApiService.getApiInfo();
      console.log('✅ API Info Success:', infoResponse);
      
      setApiResponse({
        health: healthResponse,
        info: infoResponse,
      });
      setApiStatus('connected');
      
    } catch (error) {
      console.error('❌ API Connection Failed:', error);
      setApiStatus('error');
      setApiResponse({ error: error.message });
    }
  };
  
  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  
  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      // Create guest session for anonymous browsing
      const guestSession = await ApiService.createGuestSession();
      console.log('✅ Guest session created:', guestSession);
      
      // Navigate to home screen
      navigation.navigate('Home');
      
    } catch (error) {
      console.error('❌ Failed to create guest session:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to CakeCrafter.AI services. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: handleGetStarted },
          { text: 'Continue Offline', onPress: () => navigation.navigate('Home') },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestAPI = () => {
    Alert.alert(
      'API Connection Status',
      `Status: ${apiStatus}\n\n${
        apiResponse 
          ? `Service: ${apiResponse.health?.service || 'Unknown'}\nVersion: ${apiResponse.info?.version || 'Unknown'}\nEnvironment: ${apiResponse.health?.environment || 'Unknown'}`
          : 'No response data available'
      }`,
      [
        { text: 'Retry Connection', onPress: checkApiConnection },
        { text: 'OK' },
      ]
    );
  };
  
  // ============================================================================
  // STATUS INDICATOR
  // ============================================================================
  
  const renderApiStatus = () => {
    const statusConfig = {
      checking: {
        color: QatarColors.warning,
        text: 'Connecting...',
        icon: '🔄',
      },
      connected: {
        color: QatarColors.success,
        text: 'Connected to Production API',
        icon: '✅',
      },
      error: {
        color: QatarColors.error,
        text: 'Connection Failed',
        icon: '❌',
      },
    };
    
    const config = statusConfig[apiStatus];
    
    return (
      <TouchableOpacity 
        style={[styles.statusContainer, { borderColor: config.color }]}
        onPress={handleTestAPI}
        activeOpacity={0.8}
      >
        <Text style={styles.statusIcon}>{config.icon}</Text>
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.text}
        </Text>
        {apiStatus === 'checking' && (
          <ActivityIndicator size="small" color={config.color} style={styles.statusLoader} />
        )}
      </TouchableOpacity>
    );
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={QatarColors.primary} />
      
      {/* Qatar Gradient Background */}
      <LinearGradient
        colors={[QatarColors.primary, QatarColors.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Animated Logo */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { scale: apiStatus === 'connected' ? pulseAnimation : 1 }
                ]
              }
            ]}
          >
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>🍰</Text>
            </View>
          </Animated.View>
          
          {/* Animated Title */}
          <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
            <Text style={styles.title}>CakeCrafter.AI</Text>
            <Text style={styles.subtitle}>AI-Powered Cake Design for Qatar</Text>
            <Text style={styles.version}>React Native Edition v1.0</Text>
          </Animated.View>
          
          {/* API Status */}
          <View style={styles.statusSection}>
            {renderApiStatus()}
          </View>
          
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to the Future of Cake Design</Text>
            <Text style={styles.welcomeText}>
              Experience AI-powered cake customization with Qatar's premier cake design platform. 
              Create stunning cakes for every occasion with our intelligent design assistant.
            </Text>
          </View>
          
          {/* Action Buttons */}
          <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isLoading && styles.buttonDisabled
              ]}
              onPress={handleGetStarted}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={QatarColors.textOnPrimary} />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Text style={styles.buttonEmoji}>🚀</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleTestAPI}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Test API Connection</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for Qatar • Production Backend Connected
          </Text>
          <Text style={styles.footerUrl}>
            https://cakecrafterapi.ebita.ai/api
          </Text>
        </View>
        
      </LinearGradient>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QatarColors.background,
  },
  
  gradient: {
    flex: 1,
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  
  // Logo Styles
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: QatarColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: QatarColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  
  logoEmoji: {
    fontSize: 60,
  },
  
  // Title Styles
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  
  title: {
    fontSize: Typography.fontSize.display,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: QatarColors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  
  version: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
  },
  
  // Status Styles
  statusSection: {
    marginBottom: Spacing.lg,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  statusIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  
  statusLoader: {
    marginLeft: Spacing.sm,
  },
  
  // Welcome Styles
  welcomeSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  
  welcomeTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: QatarColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  
  // Button Styles
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  
  primaryButton: {
    backgroundColor: QatarColors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: QatarColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  primaryButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnSecondary,
    marginRight: Spacing.sm,
  },
  
  buttonEmoji: {
    fontSize: Typography.fontSize.lg,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  secondaryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  
  secondaryButtonText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    textDecorationLine: 'underline',
  },
  
  // Footer Styles
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  
  footerUrl: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.secondary,
    textAlign: 'center',
  },
});

export default HelloWorldScreen;
