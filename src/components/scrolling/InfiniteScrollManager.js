// src/components/scrolling/InfiniteScrollManager.js
// Communication #60.5 - Infinite Scroll & Performance Manager
// ⚡ PERFORMANCE: Optimized infinite scrolling with pagination
// 🔄 LOADING: Smart loading states and error handling
// 🎯 QATAR: Branded loading animations and indicators

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

const { width } = Dimensions.get('window');

// ================================
// INFINITE SCROLL MANAGER COMPONENT
// ================================
const InfiniteScrollManager = ({
  isLoading = false,
  hasMoreData = true,
  onLoadMore,
  onRetry,
  error = null,
  loadingText,
  retryText,
  children,
  style,
}) => {
  
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================
  
  const { t } = useTranslation();
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // ANIMATIONS
  // ============================================================================
  
  React.useEffect(() => {
    if (isLoading) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isLoading]);
  
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  const animateSlideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMoreData || error) return;
    
    console.log('📄 InfiniteScroll: Loading more content...');
    animateSlideIn();
    
    if (onLoadMore) {
      onLoadMore();
    }
  }, [isLoading, hasMoreData, error, onLoadMore]);
  
  const handleRetry = useCallback(() => {
    setRetryAttempts(prev => prev + 1);
    console.log(`🔄 InfiniteScroll: Retry attempt #${retryAttempts + 1}`);
    
    if (onRetry) {
      onRetry();
    } else if (onLoadMore) {
      onLoadMore();
    }
  }, [onRetry, onLoadMore, retryAttempts]);
  
  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================
  
  const renderLoadingIndicator = () => {
    if (!isLoading) return null;
    
    return (
      <Animated.View 
        style={[
          styles.loadingContainer,
          { opacity: slideAnim }
        ]}
      >
        <LinearGradient
          colors={[QatarColors.surface, QatarColors.surfaceLight]}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <Animated.View
              style={[
                styles.loadingIconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <ActivityIndicator 
                size="large" 
                color={QatarColors.secondary}
              />
            </Animated.View>
            
            <Text style={styles.loadingText}>
              {loadingText || t('common.loading', 'Loading amazing content...')}
            </Text>
            
            {/* Qatar-themed loading dots */}
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    {
                      opacity: Animated.add(
                        0.3,
                        Animated.multiply(
                          0.7,
                          Animated.add(
                            1,
                            Animated.cos(
                              Animated.multiply(
                                Animated.add(slideAnim, index * 0.3),
                                Math.PI * 2
                              )
                            )
                          )
                        )
                      ),
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };
  
  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={[QatarColors.error + '20', QatarColors.surface]}
          style={styles.errorGradient}
        >
          <View style={styles.errorContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>
              {t('common.error', 'Something went wrong')}
            </Text>
            <Text style={styles.errorMessage}>
              {error.message || t('common.errorGeneric', 'Failed to load content')}
            </Text>
            
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[QatarColors.secondary, QatarColors.secondaryDark]}
                style={styles.retryGradient}
              >
                <Text style={styles.retryText}>
                  {retryText || t('common.retry', 'Retry')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {retryAttempts > 0 && (
              <Text style={styles.retryCount}>
                {t('common.retryAttempts', 'Attempts')}: {retryAttempts}
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };
  
  const renderEndMessage = () => {
    if (hasMoreData || isLoading || error) return null;
    
    return (
      <View style={styles.endContainer}>
        <View style={styles.endContent}>
          <Text style={styles.endIcon}>🎉</Text>
          <Text style={styles.endTitle}>
            {t('common.allLoaded', "You've seen it all!")}
          </Text>
          <Text style={styles.endMessage}>
            {t('common.allLoadedDesc', 'No more amazing content to show')}
          </Text>
          
          {/* Qatar flag decoration */}
          <View style={styles.qatarDecoration}>
            <Text style={styles.qatarFlag}>🇶🇦</Text>
            <Text style={styles.qatarText}>
              {t('common.madeInQatar', 'Made with ♥️ in Qatar')}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  const renderLoadMoreTrigger = () => {
    if (isLoading || error || !hasMoreData) return null;
    
    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[QatarColors.primary, QatarColors.primaryDark]}
          style={styles.loadMoreGradient}
        >
          <Text style={styles.loadMoreText}>
            {t('common.loadMore', 'Load More')}
          </Text>
          <Text style={styles.loadMoreIcon}>⬇️</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <View style={[styles.container, style]}>
      {children}
      
      <View style={styles.footerContainer}>
        {renderLoadingIndicator()}
        {renderErrorState()}
        {renderEndMessage()}
        {renderLoadMoreTrigger()}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    flex: 1,
  },
  
  footerContainer: {
    marginTop: Spacing.md,
  },
  
  // Loading Styles
  loadingContainer: {
    margin: Spacing.md,
    borderRadius: ComponentStyles.borderRadius.lg,
    overflow: 'hidden',
    ...ComponentStyles.shadows.small,
  },
  
  loadingGradient: {
    padding: Spacing.lg,
  },
  
  loadingContent: {
    alignItems: 'center',
  },
  
  loadingIconContainer: {
    marginBottom: Spacing.md,
  },
  
  loadingText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textPrimary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: QatarColors.secondary,
    marginHorizontal: 4,
  },
  
  // Error Styles
  errorContainer: {
    margin: Spacing.md,
    borderRadius: ComponentStyles.borderRadius.lg,
    overflow: 'hidden',
    ...ComponentStyles.shadows.small,
  },
  
  errorGradient: {
    padding: Spacing.lg,
  },
  
  errorContent: {
    alignItems: 'center',
  },
  
  errorIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  
  errorTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.error,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  
  errorMessage: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  retryButton: {
    borderRadius: ComponentStyles.borderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  
  retryGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  
  retryText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: QatarColors.textOnPrimary,
    textAlign: 'center',
  },
  
  retryCount: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textMuted,
    textAlign: 'center',
  },
  
  // End Message Styles
  endContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  
  endContent: {
    alignItems: 'center',
  },
  
  endIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  
  endTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  
  endMessage: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  qatarDecoration: {
    alignItems: 'center',
  },
  
  qatarFlag: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  
  qatarText: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textMuted,
    textAlign: 'center',
  },
  
  // Load More Button
  loadMoreButton: {
    margin: Spacing.md,
    borderRadius: ComponentStyles.borderRadius.md,
    overflow: 'hidden',
    ...ComponentStyles.shadows.medium,
  },
  
  loadMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  
  loadMoreText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: QatarColors.textOnPrimary,
    marginRight: Spacing.sm,
  },
  
  loadMoreIcon: {
    fontSize: Typography.fontSize.md,
  },
};

export default InfiniteScrollManager;
