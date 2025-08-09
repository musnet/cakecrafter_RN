// src/components/cart/CartSummary.js
// Communication #60.6 - PREMIUM: Cart Summary with Qatar Heritage Styling
// 🛒 FEATURES: Total calculations, taxes, shipping, discounts display
// 🎯 INTEGRATION: CartContext integration for real-time calculations
// ⚡ ANIMATIONS: Number counting animations, highlight effects
// 🎨 LUXURY: Qatar gold and maroon themed summary card
// 🌐 i18n: Arabic/English RTL/LTR support with proper formatting

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

// Import context and styling
import { useCart } from '../../context/CartContext';
import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

// ================================
// CART SUMMARY COMPONENT - Communication #60.6
// ================================
const CartSummary = ({
  totalItems,
  totalPrice,
  formattedTotal,
  style = {},
  showBreakdown = true,
  showPromoCode = true,
  showShipping = true,
  onPromoCodePress,
  onShippingInfoPress,
}) => {
  
  // ============================================================================
  // HOOKS & CONTEXT - Communication #60.6
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { 
    formatPrice,
    averageItemPrice,
    uniqueItemsCount,
  } = useCart();
  
  // ============================================================================
  // STATE & REFS - Communication #60.6
  // ============================================================================
  
  const [showDetails, setShowDetails] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(totalPrice);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;
  const totalCountAnim = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // CALCULATIONS - Communication #60.6
  // ============================================================================
  
  const subtotal = totalPrice;
  const taxRate = 0.05; // 5% Qatar VAT
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal >= 100 ? 0 : 15; // Free shipping over QAR 100
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + taxAmount + shippingCost - discountAmount;
  
  const formattedSubtotal = `QAR ${subtotal.toFixed(2)}`;
  const formattedTax = `QAR ${taxAmount.toFixed(2)}`;
  const formattedShipping = shippingCost === 0 ? 'FREE' : `QAR ${shippingCost.toFixed(2)}`;
  const formattedDiscount = discountAmount > 0 ? `QAR ${discountAmount.toFixed(2)}` : null;
  const formattedFinalTotal = `QAR ${finalTotal.toFixed(2)}`;
  
  // ============================================================================
  // ANIMATION EFFECTS - Communication #60.6
  // ============================================================================
  
  // Animate total changes
  useEffect(() => {
    if (totalPrice !== animatedTotal) {
      // Highlight animation for total change
      Animated.sequence([
        Animated.timing(highlightAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
      
      // Count animation for total
      Animated.timing(totalCountAnim, {
        toValue: totalPrice,
        duration: 500,
        useNativeDriver: false,
      }).start();
      
      setAnimatedTotal(totalPrice);
    }
  }, [totalPrice]);
  
  // Details expand/collapse animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showDetails ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showDetails]);
  
  // ============================================================================
  // EVENT HANDLERS - Communication #60.6
  // ============================================================================
  
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    console.log(`📊 Communication #60.6 - Toggle summary details: ${!showDetails}`);
  };
  
  const handlePromoCode = () => {
    if (onPromoCodePress) {
      onPromoCodePress();
    } else {
      // Default promo code handler
      console.log('🎫 Communication #60.6 - Promo code pressed');
      // Could open promo code modal here
    }
  };
  
  const handleShippingInfo = () => {
    if (onShippingInfoPress) {
      onShippingInfoPress();
    } else {
      // Default shipping info handler
      console.log('🚚 Communication #60.6 - Shipping info pressed');
      // Could open shipping info modal here
    }
  };
  
  // ============================================================================
  // RENDER METHODS - Communication #60.6
  // ============================================================================
  
  const renderSummaryHeader = () => (
    <TouchableOpacity
      style={styles.summaryHeader}
      onPress={handleToggleDetails}
      activeOpacity={0.8}
    >
      <View style={styles.headerLeft}>
        <Text style={styles.summaryTitle}>
          {isRTL ? 'ملخص الطلب' : 'Order Summary'}
        </Text>
        <Text style={styles.itemCount}>
          {isRTL 
            ? `${totalItems} عنصر • ${uniqueItemsCount} نوع`
            : `${totalItems} items • ${uniqueItemsCount} types`
          }
        </Text>
      </View>
      
      <View style={styles.headerRight}>
        <Text style={styles.totalAmount}>
          {formattedFinalTotal}
        </Text>
        <Text style={styles.expandIcon}>
          {showDetails ? '▲' : '▼'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderBreakdownDetails = () => {
    if (!showBreakdown) return null;
    
    const detailsHeight = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200], // Adjust based on content
    });
    
    return (
      <Animated.View
        style={[
          styles.breakdownContainer,
          {
            height: detailsHeight,
            opacity: slideAnim,
          },
        ]}
      >
        <View style={styles.breakdown}>
          {/* Subtotal */}
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              {isRTL ? 'المجموع الفرعي' : 'Subtotal'}
            </Text>
            <Text style={styles.breakdownValue}>
              {formattedSubtotal}
            </Text>
          </View>
          
          {/* Tax */}
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              {isRTL ? 'ضريبة القيمة المضافة (5%)' : 'VAT (5%)'}
            </Text>
            <Text style={styles.breakdownValue}>
              {formattedTax}
            </Text>
          </View>
          
          {/* Shipping */}
          {showShipping && (
            <View style={styles.breakdownRow}>
              <TouchableOpacity onPress={handleShippingInfo}>
                <Text style={styles.breakdownLabelInteractive}>
                  {isRTL ? 'الشحن' : 'Shipping'} ℹ️
                </Text>
              </TouchableOpacity>
              <Text style={[
                styles.breakdownValue,
                shippingCost === 0 && styles.freeShipping,
              ]}>
                {formattedShipping}
              </Text>
            </View>
          )}
          
          {/* Discount */}
          {formattedDiscount && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelDiscount}>
                {isRTL ? 'خصم' : 'Discount'}
              </Text>
              <Text style={styles.breakdownValueDiscount}>
                -{formattedDiscount}
              </Text>
            </View>
          )}
          
          {/* Promo Code */}
          {showPromoCode && !promoCode && (
            <TouchableOpacity
              style={styles.promoCodeButton}
              onPress={handlePromoCode}
            >
              <Text style={styles.promoCodeText}>
                {isRTL ? '+ إضافة كود خصم' : '+ Add Promo Code'}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Applied Promo Code */}
          {promoCode && (
            <View style={styles.appliedPromoCode}>
              <Text style={styles.appliedPromoText}>
                {isRTL ? `كود الخصم: ${promoCode}` : `Promo: ${promoCode}`}
              </Text>
              <TouchableOpacity onPress={() => setPromoCode('')}>
                <Text style={styles.removePromoText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };
  
  const renderTotal = () => {
    const highlightColor = highlightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [QatarColors.surface, QatarColors.secondary],
    });
    
    return (
      <Animated.View
        style={[
          styles.totalContainer,
          {
            backgroundColor: highlightColor,
          },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {isRTL ? 'الإجمالي' : 'Total'}
          </Text>
          <Text style={styles.totalValue}>
            {formattedFinalTotal}
          </Text>
        </View>
        
        {/* Savings indicator */}
        {discountAmount > 0 && (
          <Text style={styles.savingsText}>
            {isRTL 
              ? `وفرت ${formattedDiscount}!` 
              : `You saved ${formattedDiscount}!`
            }
          </Text>
        )}
        
        {/* Free shipping indicator */}
        {shippingCost === 0 && subtotal >= 100 && (
          <Text style={styles.freeShippingText}>
            {isRTL ? '🚚 شحن مجاني!' : '🚚 Free shipping!'}
          </Text>
        )}
      </Animated.View>
    );
  };
  
  const renderQuickStats = () => (
    <View style={styles.quickStats}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          QAR {parseFloat(averageItemPrice).toFixed(0)}
        </Text>
        <Text style={styles.statLabel}>
          {isRTL ? 'متوسط السعر' : 'Avg. Price'}
        </Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {uniqueItemsCount}
        </Text>
        <Text style={styles.statLabel}>
          {isRTL ? 'أنواع مختلفة' : 'Different Items'}
        </Text>
      </View>
    </View>
  );
  
  // ============================================================================
  // MAIN RENDER - Communication #60.6
  // ============================================================================
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[QatarColors.surface, QatarColors.surfaceLight]}
        style={styles.gradient}
      >
        {/* Summary Header */}
        {renderSummaryHeader()}
        
        {/* Breakdown Details */}
        {renderBreakdownDetails()}
        
        {/* Quick Stats */}
        {showDetails && renderQuickStats()}
        
        {/* Total */}
        {renderTotal()}
      </LinearGradient>
    </View>
  );
};

// ============================================================================
// STYLES - Communication #60.6
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    ...ComponentStyles.shadows.medium,
  },
  
  gradient: {
    flex: 1,
  },
  
  // Header Styles
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  headerLeft: {
    flex: 1,
  },
  
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginBottom: 4,
  },
  
  itemCount: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
  },
  
  headerRight: {
    alignItems: 'flex-end',
  },
  
  totalAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.secondary,
    marginBottom: 4,
  },
  
  expandIcon: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
  },
  
  // Breakdown Styles
  breakdownContainer: {
    overflow: 'hidden',
  },
  
  breakdown: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  breakdownLabel: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
  },
  
  breakdownLabelInteractive: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.secondary,
    textDecorationLine: 'underline',
  },
  
  breakdownLabelDiscount: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.success,
  },
  
  breakdownValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.textPrimary,
  },
  
  breakdownValueDiscount: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.success,
  },
  
  freeShipping: {
    color: QatarColors.success,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Promo Code Styles
  promoCodeButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  
  promoCodeText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
  
  appliedPromoCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  
  appliedPromoText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  
  removePromoText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.error,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Quick Stats Styles
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.secondary,
    marginBottom: 2,
  },
  
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textSecondary,
    textAlign: 'center',
  },
  
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.md,
  },
  
  // Total Styles
  totalContainer: {
    padding: Spacing.lg,
    borderTopWidth: 2,
    borderTopColor: QatarColors.secondary,
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  totalLabel: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  totalValue: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.secondary,
  },
  
  savingsText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.success,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: 4,
  },
  
  freeShippingText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.success,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CartSummary;
