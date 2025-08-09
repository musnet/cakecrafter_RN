// src/components/gallery/CakeCardAnimated.js
// Communication #61.11 - ULTRA STABLE: Zero vibration animations
// 🔧 PERFORMANCE: Minimal animations, maximum stability
// ✨ ZERO VIBRATION: Completely stable rendering
// 🎨 QATAR: Clean luxury design

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

// ================================
// ULTRA STABLE CAKE CARD COMPONENT
// ================================
const CakeCardAnimated = ({
  item,
  index = 0,
  style,
  onPress,
  currentLanguage = 'en',
  layoutMode = 'masonry',
  onLayout,
}) => {
  
  // ============================================================================
  // MINIMAL STATE - PREVENT RE-RENDERS
  // ============================================================================
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // SINGLE animation value only - NO MULTIPLICATION
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Static height - no dynamic changes
  const cardHeight = item.height || 200;
  
  // ============================================================================
  // SINGLE EFFECT - MINIMAL TRIGGERS
  // ============================================================================
  
  useEffect(() => {
    // Simple one-time fade in - NO LOOPS, NO COMPLEX LOGIC
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, index * 50); // Simple stagger
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run only once
  
  // Notify layout ONCE when image loads
  useEffect(() => {
    if (imageLoaded && onLayout) {
      onLayout(cardHeight);
    }
  }, [imageLoaded]); // Only when image loads, not on every render
  
  // ============================================================================
  // SIMPLE HANDLERS - NO ANIMATIONS
  // ============================================================================
  
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderImage = () => {
    if (imageError) {
      return (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>🍰</Text>
          <Text style={styles.placeholderText}>Image not available</Text>
        </View>
      );
    }
    
    return (
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    );
  };
  
  // ============================================================================
  // MAIN RENDER - ULTRA SIMPLE
  // ============================================================================
  
  const isGallery = item.type === 'gallery';
  const displayName = item.name || 'Creative Cake Design';
  
  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        style,
        { opacity: fadeAnim }, // SINGLE transform only
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { height: cardHeight }]}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        {/* Card Background */}
        <View style={styles.cardBackground}>
          
          {/* Image Section */}
          <View style={[styles.imageContainer, { height: cardHeight - 80 }]}>
            {renderImage()}
            
            {/* Simple overlay */}
            {imageLoaded && !imageError && (
              <View style={styles.simpleOverlay} />
            )}
            
            {/* Category Badge */}
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
            )}
            
            {/* Favorite Button */}
            <View style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>❤️</Text>
            </View>
          </View>
          
          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {displayName}
              </Text>
              
              {item.rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                </View>
              )}
            </View>
            
            {item.price && (
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{item.price}</Text>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </View>
            )}
            
            {isGallery && (
              <View style={styles.galleryInfo}>
                <Text style={styles.galleryLabel}>View Design</Text>
                <Text style={styles.galleryIcon}>👁️</Text>
              </View>
            )}
          </View>
          
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// ULTRA STABLE STYLES - NO COMPLEX EFFECTS
// ============================================================================

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: Spacing.sm,
  },
  
  card: {
    borderRadius: ComponentStyles.borderRadius.lg,
    overflow: 'hidden',
    // Simple shadow - no complex effects
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  cardBackground: {
    flex: 1,
    backgroundColor: QatarColors.surface,
  },
  
  // Image Styles
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: QatarColors.surface,
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
  },
  
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: QatarColors.surface,
  },
  
  placeholderIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  
  placeholderText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
  },
  
  // Simple overlay - no gradients
  simpleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  
  // Simple UI elements
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  favoriteIcon: {
    fontSize: 16,
  },
  
  categoryBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(139, 21, 56, 0.9)', // Qatar maroon
    borderRadius: ComponentStyles.borderRadius.sm,
  },
  
  categoryText: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textOnPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Info Section
  infoSection: {
    padding: Spacing.sm,
  },
  
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  
  cardTitle: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: QatarColors.textPrimary,
    marginRight: Spacing.xs,
  },
  
  ratingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ComponentStyles.borderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  
  ratingText: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  priceText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.secondary,
  },
  
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: QatarColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  addButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  galleryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  galleryLabel: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  galleryIcon: {
    fontSize: Typography.fontSize.md,
  },
});

export default CakeCardAnimated;
