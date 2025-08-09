// src/components/cart/CartIcon.js
// Communication #60.6 - PREMIUM: Animated Cart Icon with Item Count Badge
// 🛒 FEATURES: Floating cart button, animated badge, Qatar-branded styling
// 🎯 INTEGRATION: Connect to CartContext for real-time cart updates
// ⚡ ANIMATIONS: Bounce effects, scale animations, badge transitions
// 🎨 LUXURY: Qatar branding with maroon and gold colors

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

// ================================
// CART ICON COMPONENT - Communication #60.6
// ================================
const CartIcon = ({ 
  onPress,
  style = {},
  position = 'fixed', // 'fixed' or 'relative'
  size = 'medium', // 'small', 'medium', 'large'
  showBadge = true,
  customIcon = null,
}) => {
  
  // ============================================================================
  // CART CONTEXT & STATE - Communication #60.6
  // ============================================================================
  
  const { 
    totalItems, 
    isCartVisible, 
    setCartVisible,
    lastAddedItem,
    isEmpty,
  } = useCart();
  
  // ============================================================================
  // ANIMATION REFS - Communication #60.6
  // ============================================================================
  
  const iconScale = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // ANIMATION EFFECTS - Communication #60.6
  // ============================================================================
  
  // Badge animation when items are added/removed
  useEffect(() => {
    if (totalItems > 0) {
      // Show badge with bounce effect
      Animated.parallel([
        Animated.spring(badgeScale, {
          toValue: 1,
          tension: 180,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide badge smoothly
      Animated.parallel([
        Animated.timing(badgeScale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(badgeOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [totalItems]);
  
  // Pulse animation when new item is added
  useEffect(() => {
    if (lastAddedItem) {
      console.log(`🛒 Communication #60.6 - Cart icon animation: ${lastAddedItem.name} added`);
      
      // Icon bounce effect
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Badge pulse effect
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [lastAddedItem]);
  
  // Continuous subtle bounce when cart has items
  useEffect(() => {
    if (totalItems > 0) {
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      
      bounceLoop.start();
      
      return () => bounceLoop.stop();
    }
  }, [totalItems]);
  
  // ============================================================================
  // SIZE CONFIGURATIONS - Communication #60.6
  // ============================================================================
  
  const sizeConfig = {
    small: {
      containerSize: 40,
      iconSize: 20,
      badgeSize: 18,
      fontSize: Typography.fontSize.xs,
    },
    medium: {
      containerSize: 56,
      iconSize: 28,
      badgeSize: 22,
      fontSize: Typography.fontSize.sm,
    },
    large: {
      containerSize: 72,
      iconSize: 36,
      badgeSize: 26,
      fontSize: Typography.fontSize.md,
    },
  };
  
  const config = sizeConfig[size];
  
  // ============================================================================
  // EVENT HANDLERS - Communication #60.6
  // ============================================================================
  
  const handleCartPress = () => {
    console.log(`🛒 Communication #60.6 - Cart icon pressed (${totalItems} items)`);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Custom onPress or default cart visibility toggle
    if (onPress) {
      onPress();
    } else {
      setCartVisible(!isCartVisible);
    }
  };
  
  // ============================================================================
  // POSITION STYLES - Communication #60.6
  // ============================================================================
  
  const getPositionStyle = () => {
    if (position === 'fixed') {
      return {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 24,
        right: 20,
        zIndex: 1000,
      };
    }
    return {};
  };
  
  // ============================================================================
  // RENDER METHODS - Communication #60.6
  // ============================================================================
  
  const renderCartIcon = () => {
    if (customIcon) {
      return customIcon;
    }
    
    return (
      <Text style={[styles.cartIcon, { fontSize: config.iconSize }]}>
        🛒
      </Text>
    );
  };
  
  const renderBadge = () => {
    if (!showBadge || totalItems === 0) {
      return null;
    }
    
    const displayCount = totalItems > 99 ? '99+' : totalItems.toString();
    
    return (
      <Animated.View
        style={[
          styles.badge,
          {
            width: config.badgeSize,
            height: config.badgeSize,
            borderRadius: config.badgeSize / 2,
            transform: [
              { scale: Animated.multiply(badgeScale, pulseAnimation) },
            ],
            opacity: badgeOpacity,
          },
        ]}
      >
        <Text style={[styles.badgeText, { fontSize: config.fontSize }]}>
          {displayCount}
        </Text>
      </Animated.View>
    );
  };
  
  // ============================================================================
  // MAIN RENDER - Communication #60.6
  // ============================================================================
  
  const bounceTranslateY = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });
  
  return (
    <Animated.View
      style={[
        getPositionStyle(),
        style,
        {
          transform: [
            { translateY: bounceTranslateY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.cartButton,
          {
            width: config.containerSize,
            height: config.containerSize,
            borderRadius: config.containerSize / 2,
          },
          isEmpty && styles.cartButtonEmpty,
        ]}
        onPress={handleCartPress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          {renderCartIcon()}
        </Animated.View>
        
        {renderBadge()}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// STYLES - Communication #60.6
// ============================================================================

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: QatarColors.primary, // Qatar Maroon
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: QatarColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Gradient border effect
    borderWidth: 2,
    borderColor: QatarColors.secondary, // Qatar Gold border
  },
  
  cartButtonEmpty: {
    backgroundColor: QatarColors.surfaceLight,
    borderColor: QatarColors.textSecondary,
    shadowOpacity: 0.1,
  },
  
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cartIcon: {
    color: QatarColors.textOnPrimary,
    textAlign: 'center',
  },
  
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: QatarColors.secondary, // Qatar Gold
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: QatarColors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: QatarColors.textOnPrimary,
  },
  
  badgeText: {
    color: QatarColors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default CartIcon;
