// src/screens/HomeScreen.js - Communication #62: Enhanced with SuperDuperHomeScreen Navigation
// Added navigation to the ultimate SuperDuperHomeScreen experience

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiService } from '../services/ApiService';
import { QatarColors, Spacing, Typography } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [isLoading, setIsLoading] = useState(false);
  const [cakes, setCakes] = useState([]);
  const [error, setError] = useState(null);
  
  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  
  useEffect(() => {
    loadCakes();
  }, []);
  
  // ============================================================================
  // API CALLS
  // ============================================================================
  
  const loadCakes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🍰 Loading cakes from production API...');
      const response = await ApiService.getCakes({ limit: 10 });
      
      console.log('✅ Cakes loaded successfully:', response);
      setCakes(response.results || response.data || []);
      
    } catch (error) {
      console.error('❌ Failed to load cakes:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleBackToWelcome = () => {
    navigation.navigate('HelloWorld');
  };
  
  const handleSuperDuperHome = () => {
    navigation.navigate('SuperDuperHome');
  };
  
  const handleTestAPIFeatures = () => {
    Alert.alert(
      'API Features Test',
      'Choose an API endpoint to test:',
      [
        {
          text: 'Test Health Check',
          onPress: testHealthCheck,
        },
        {
          text: 'Test User Data',
          onPress: testUserData,
        },
        {
          text: 'Test Guest Session',
          onPress: testGuestSession,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  const testHealthCheck = async () => {
    try {
      setIsLoading(true);
      const health = await ApiService.checkHealth();
      Alert.alert('Health Check Success', JSON.stringify(health, null, 2));
    } catch (error) {
      Alert.alert('Health Check Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testUserData = async () => {
    try {
      setIsLoading(true);
      const users = await ApiService.getUsers({ limit: 5 });
      Alert.alert('Users Loaded', `Found ${users.results?.length || 0} users`);
    } catch (error) {
      Alert.alert('Users Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testGuestSession = async () => {
    try {
      setIsLoading(true);
      const session = await ApiService.createGuestSession();
      Alert.alert('Guest Session Created', JSON.stringify(session, null, 2));
    } catch (error) {
      Alert.alert('Guest Session Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================
  
  const renderHeader = () => (
    <LinearGradient
      colors={[QatarColors.primary, QatarColors.primaryDark]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>CakeCrafter.AI</Text>
        <Text style={styles.headerSubtitle}>Basic Home Screen</Text>
      </View>
    </LinearGradient>
  );
  
  const renderApiStatus = () => (
    <View style={styles.statusCard}>
      <Text style={styles.cardTitle}>🌐 Production API Status</Text>
      <Text style={styles.statusText}>
        Connected to: https://cakecrafterapi.ebita.ai/api
      </Text>
      <Text style={styles.statusSuccess}>✅ Backend Connection Active</Text>
    </View>
  );
  
  const renderSuperDuperNavigation = () => (
    <View style={styles.superDuperCard}>
      <LinearGradient
        colors={[QatarColors.secondary, QatarColors.secondaryDark]}
        style={styles.superDuperGradient}
      >
        <Text style={styles.superDuperTitle}>🎨 Ultimate Experience</Text>
        <Text style={styles.superDuperSubtitle}>
          Experience the Super Duper Home Screen with stunning visuals, 
          beautiful cake galleries, and Qatar-inspired design
        </Text>
        
        <View style={styles.superDuperFeatures}>
          <Text style={styles.featureItem}>✨ Beautiful cake showcase</Text>
          <Text style={styles.featureItem}>🍰 Interactive categories</Text>
          <Text style={styles.featureItem}>🎨 Qatar cultural theme</Text>
          <Text style={styles.featureItem}>🤖 AI generation ready</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.superDuperButton}
          onPress={handleSuperDuperHome}
          activeOpacity={0.8}
        >
          <Text style={styles.superDuperButtonText}>
            Launch Super Duper Home 🚀
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
  
  const renderCakesList = () => {
    if (isLoading && cakes.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={QatarColors.primary} />
          <Text style={styles.loadingText}>Loading cakes from production API...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>❌ API Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCakes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.cakesCard}>
        <Text style={styles.cardTitle}>🍰 Available Cakes</Text>
        {cakes.length > 0 ? (
          <View style={styles.cakesList}>
            {cakes.slice(0, 5).map((cake, index) => (
              <View key={index} style={styles.cakeItem}>
                <Text style={styles.cakeName}>
                  {cake.name || cake.title || `Cake #${index + 1}`}
                </Text>
                <Text style={styles.cakePrice}>
                  {cake.price ? `${cake.price} QAR` : 'Price on request'}
                </Text>
              </View>
            ))}
            {cakes.length > 5 && (
              <Text style={styles.moreText}>+{cakes.length - 5} more cakes...</Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyText}>No cakes available</Text>
        )}
      </View>
    );
  };
  
  const renderActionButtons = () => (
    <View style={styles.actionsCard}>
      <Text style={styles.cardTitle}>🛠️ Available Actions</Text>
      
      <TouchableOpacity style={styles.actionButton} onPress={handleTestAPIFeatures}>
        <Text style={styles.actionButtonText}>Test API Features</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={loadCakes}>
        <Text style={styles.actionButtonText}>Refresh Cakes</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.secondaryButton]} 
        onPress={handleBackToWelcome}
      >
        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
          Back to Welcome
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderNextSteps = () => (
    <View style={styles.nextStepsCard}>
      <Text style={styles.cardTitle}>🚀 Development Progress</Text>
      <View style={styles.stepsList}>
        <Text style={styles.stepItem}>✅ Hello World Screen</Text>
        <Text style={styles.stepItem}>✅ Production API Integration</Text>
        <Text style={styles.stepItem}>✅ Qatar Brand Theme System</Text>
        <Text style={styles.stepItem}>✅ Basic Navigation</Text>
        <Text style={styles.stepItem}>✅ SuperDuperHomeScreen with Cake Gallery</Text>
        <Text style={styles.stepItem}>🔄 Login/OTP System (Next)</Text>
        <Text style={styles.stepItem}>🔄 AI Generation Features (Next)</Text>
        <Text style={styles.stepItem}>🔄 Cart & Ordering System (Next)</Text>
      </View>
    </View>
  );
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {renderApiStatus()}
        {renderSuperDuperNavigation()}
        {renderCakesList()}
        {renderActionButtons()}
        {renderNextSteps()}
        
      </ScrollView>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={QatarColors.primary} />
        </View>
      )}
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
  
  // Header Styles
  header: {
    paddingVertical: Spacing.lg,
  },
  
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  
  headerTitle: {
    fontSize: Typography.fontSize.display,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
    marginBottom: Spacing.xs,
  },
  
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: QatarColors.secondary,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: Spacing.md,
  },
  
  // Card Styles
  statusCard: {
    backgroundColor: QatarColors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: QatarColors.success,
  },
  
  superDuperCard: {
    marginBottom: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  superDuperGradient: {
    padding: Spacing.lg,
  },
  
  superDuperTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  
  superDuperSubtitle: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textOnSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  
  superDuperFeatures: {
    marginBottom: Spacing.lg,
  },
  
  featureItem: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textOnSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  
  superDuperButton: {
    backgroundColor: QatarColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: QatarColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  superDuperButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  cakesCard: {
    backgroundColor: QatarColors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  
  actionsCard: {
    backgroundColor: QatarColors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  
  nextStepsCard: {
    backgroundColor: QatarColors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  
  errorCard: {
    backgroundColor: QatarColors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: QatarColors.error,
  },
  
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  // Status Styles
  statusText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  
  statusSuccess: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  
  loadingText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Cakes List Styles
  cakesList: {
    marginTop: Spacing.sm,
  },
  
  cakeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: QatarColors.border,
  },
  
  cakeName: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textPrimary,
    flex: 1,
  },
  
  cakePrice: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  moreText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Error Styles
  errorTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.error,
    marginBottom: Spacing.sm,
  },
  
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginBottom: Spacing.md,
  },
  
  retryButton: {
    backgroundColor: QatarColors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  retryButtonText: {
    color: QatarColors.textOnPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Action Button Styles
  actionButton: {
    backgroundColor: QatarColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  
  actionButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.textOnPrimary,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: QatarColors.border,
  },
  
  secondaryButtonText: {
    color: QatarColors.textSecondary,
  },
  
  // Steps List Styles
  stepsList: {
    marginTop: Spacing.sm,
  },
  
  stepItem: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});

export default HomeScreen;
