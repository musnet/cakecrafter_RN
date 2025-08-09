// src/components/cart/CartItem.js
// Communication #60.6 - PREMIUM: Individual Cart Item Component
// 🛒 FEATURES: Item display, quantity controls, remove/save actions
// 🎯 INTEGRATION: CartContext integration for item management
// ⚡ ANIMATIONS: Swipe gestures, button animations, quantity transitions
// 🎨 LUXURY: Qatar heritage styling with glassmorphism effects
// 🌐 i18n: Arabic/English RTL/LTR support

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
  PanGestureHandler,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

// Import context and styling
import { useCart } from '../../context/CartContext';
import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

// ================================
// CART ITEM COMPONENT - Communication #60.6
// ================================
const CartItem = ({
  item,
  index = 0,
  isInSavedForLater = false,
  onRemove,
  onUpdateQuantity,
  onSaveForLater,
  onMoveToCart,
  style = {},
  showSwipeActions = true,
}) => {
  
  // ============================================================================
  // HOOKS & CONTEXT - Communication #60.6
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { formatPrice, CART_CONFIG } = useCart();
  
  // ============================================================================
  // STATE & REFS - Communication #60.6
  // ============================================================================
  
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const quantityAnim = useRef(new Animated.Value(1)).current;
  const removeAnim = useRef(new Animated.Value(1)).current;
  
  // ============================================================================
  // COMPUTED VALUES - Communication #60.6
  // ============================================================================
  
  const itemPrice = formatPrice(item.price);
  const itemTotal = itemPrice * quantity;
  const formattedItemTotal = `QAR ${itemTotal.toFixed(2)}`;
  
  const displayName = isRTL ? (item.nameAr || item.name) : item.name;
  const displayCategory = item.categoryName || item.category || '';
  
  // ============================================================================
  // ANIMATION EFFECTS - Communication #60.6
  // ============================================================================
  
  // Entrance animation
  useEffect(() => {
    const delay = index * 100; // Stagger items
    
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Quantity change animation
  useEffect(() => {
    if (quantity !== item.quantity) {
      Animated.sequence([
        Animated.timing(quantityAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(quantityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [quantity]);
  
  // ============================================================================
  // EVENT HANDLERS - Communication #60.6
  // ============================================================================
  
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > CART_CONFIG.MAX_QUANTITY_PER_ITEM) {
      return;
    }
    
    if (newQuantity === quantity) {
      return;
    }
    
    try {
      setIsUpdating(true);
      setQuantity(newQuantity);
      
      console.log(`🔢 Communication #60.6 - Quantity change: ${item.name} -> ${newQuantity}`);
      
      if (onUpdateQuantity) {
        await onUpdateQuantity(newQuantity);
      }
      
    } catch (error) {
      console.error('❌ Quantity update error:', error);
      // Revert quantity on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleIncrement = () => {
    const newQuantity = Math.min(quantity + 1, CART_CONFIG.MAX_QUANTITY_PER_ITEM);
    handleQuantityChange(newQuantity);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    } else {
      // If quantity is 1, ask user if they want to remove item
      handleRemoveConfirmation();
    }
  };
  
  const handleRemoveConfirmation = () => {
    const title = isRTL ? 'إزالة العنصر' : 'Remove Item';
    const message = isRTL 
      ? `هل تريد إزالة "${displayName}" من السلة؟`
      : `Remove "${displayName}" from your cart?`;
    const cancelText = isRTL ? 'إلغاء' : 'Cancel';
    const removeText = isRTL ? 'إزالة' : 'Remove';
    
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel' },
        { 
          text: removeText, 
          style: 'destructive',
          onPress: handleRemove
        },
      ]
    );
  };
  
  const handleRemove = () => {
    console.log(`🗑️ Communication #60.6 - Removing item: ${item.name}`);
    
    // Remove animation
    Animated.timing(removeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onRemove) {
        onRemove();
      }
    });
  };
  
  const handleSaveForLater = () => {
    console.log(`💾 Communication #60.6 - Save for later: ${item.name}`);
    
    if (onSaveForLater) {
      onSaveForLater();
    }
  };
  
  const handleMoveToCart = () => {
    console.log(`↩️ Communication #60.6 - Move to cart: ${item.name}`);
    
    if (onMoveToCart) {
      onMoveToCart();
    }
  };
  
  const handleImagePress = () => {
    // Scale animation for image press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Could trigger image preview modal here
    console.log(`🖼️ Communication #60.6 - Image pressed: ${item.name}`);
  };
  
  // ============================================================================
  // RENDER METHODS - Communication #60.6
  // ============================================================================
  
  const renderImage = () => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={handleImagePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
        onError={(error) => {
          console.warn(`🖼️ Communication #60.6 - Image load error for ${item.name}:`, error);
        }}
      />
      
      {/* Image overlay with glassmorphism */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        style={styles.imageOverlay}
      />
      
      {/* New item badge */}
      {item.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>
            {isRTL ? 'جديد' : 'NEW'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderItemInfo = () => (
    <View style={styles.itemInfo}>
      {/* Item Name */}
      <Text style={styles.itemName} numberOfLines={2}>
        {displayName}
      </Text>
      
      {/* Category */}
      {displayCategory && (
        <Text style={styles.itemCategory}>
          {displayCategory}
        </Text>
      )}
      
      {/* Price Info */}
      <View style={styles.priceContainer}>
        <Text style={styles.itemPrice}>
          {item.price}
        </Text>
        {quantity > 1 && (
          <Text style={styles.itemTotal}>
            {isRTL ? `الإجمالي: ${formattedItemTotal}` : `Total: ${formattedItemTotal}`}
          </Text>
        )}
      </View>
      
      {/* Additional Info */}
      {item.rating && (
        <Text style={styles.itemRating}>
          ⭐ {item.rating}
        </Text>
      )}
    </View>
  );
  
  const renderQuantityControls = () => {
    if (isInSavedForLater) {
      return null;
    }
    
    return (
      <Animated.View
        style={[
          styles.quantityControls,
          {
            transform: [{ scale: quantityAnim }],
          },
        ]}
      >
        {/* Decrease Button */}
        <TouchableOpacity
          style={[
            styles.quantityButton,
            quantity <= 1 && styles.quantityButtonDanger,
          ]}
          onPress={handleDecrement}
          disabled={isUpdating}
        >
          <Text style={[
            styles.quantityButtonText,
            quantity <= 1 && styles.quantityButtonTextDanger,
          ]}>
            {quantity <= 1 ? '🗑️' : '−'}
          </Text>
        </TouchableOpacity>
        
        {/* Quantity Display */}
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>
            {quantity}
          </Text>
          {isUpdating && (
            <View style={styles.quantityLoader}>
              <Text style={styles.quantityLoaderText}>•</Text>
            </View>
          )}
        </View>
        
        {/* Increase Button */}
        <TouchableOpacity
          style={[
            styles.quantityButton,
            quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM && styles.quantityButtonDisabled,
          ]}
          onPress={handleIncrement}
          disabled={isUpdating || quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {isInSavedForLater ? (
        // Saved for later actions
        <TouchableOpacity
          style={styles.moveToCartButton}
          onPress={handleMoveToCart}
        >
          <Text style={styles.moveToCartButtonText}>
            {isRTL ? 'نقل للسلة' : 'Move to Cart'}
          </Text>
        </TouchableOpacity>
      ) : (
        // Cart actions
        <TouchableOpacity
          style={styles.saveForLaterButton}
          onPress={handleSaveForLater}
        >
          <Text style={styles.saveForLaterButtonText}>
            {isRTL ? 'حفظ لاحقاً' : 'Save for Later'}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemoveConfirmation}
      >
        <Text style={styles.removeButtonText}>
          {isRTL ? 'إزالة' : 'Remove'}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // ============================================================================
  // MAIN RENDER - Communication #60.6
  // ============================================================================
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { scale: removeAnim },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[QatarColors.surface, QatarColors.surfaceLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Main Content Row */}
          <View style={styles.mainContent}>
            {/* Product Image */}
            {renderImage()}
            
            {/* Item Information */}
            {renderItemInfo()}
            
            {/* Quantity Controls */}
            {renderQuantityControls()}
          </View>
          
          {/* Action Buttons */}
          {renderActionButtons()}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// ============================================================================
// STYLES - Communication #60.6
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...ComponentStyles.shadows.medium,
  },
  
  gradient: {
    flex: 1,
  },
  
  content: {
    padding: Spacing.md,
  },
  
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  
  // Image Styles
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: Spacing.md,
    position: 'relative',
  },
  
  itemImage: {
    width: '100%',
    height: '100%',
  },
  
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  
  newBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: QatarColors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  newBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  // Item Info Styles
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  
  itemName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginBottom: 4,
    lineHeight: Typography.fontSize.md * 1.3,
  },
  
  itemCategory: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginBottom: 6,
  },
  
  priceContainer: {
    marginBottom: 4,
  },
  
  itemPrice: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.secondary,
  },
  
  itemTotal: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginTop: 2,
  },
  
  itemRating: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
  },
  
  // Quantity Controls
  quantityControls: {
    alignItems: 'center',
  },
  
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: QatarColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  
  quantityButtonDanger: {
    backgroundColor: QatarColors.error,
  },
  
  quantityButtonDisabled: {
    backgroundColor: QatarColors.textMuted,
    opacity: 0.5,
  },
  
  quantityButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  quantityButtonTextDanger: {
    color: QatarColors.textOnPrimary,
  },
  
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  
  quantityText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  quantityLoader: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -4,
  },
  
  quantityLoaderText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    opacity: 0.8,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Spacing.md,
  },
  
  saveForLaterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: QatarColors.secondary,
  },
  
  saveForLaterButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  moveToCartButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: QatarColors.secondary,
  },
  
  moveToCartButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  removeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: QatarColors.error,
  },
  
  removeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.error,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default CartItem;
