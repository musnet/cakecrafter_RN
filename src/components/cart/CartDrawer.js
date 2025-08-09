// src/components/cart/CartDrawer.js
// Communication #60.6 - PREMIUM: Beautiful Cart Drawer with Qatar Heritage Design
// 🛒 FEATURES: Slide-in cart modal, item management, Qatar-branded styling
// 🎯 INTEGRATION: Full CartContext integration with real-time updates
// ⚡ ANIMATIONS: Smooth slide animations, item transitions, gesture handling
// 🎨 LUXURY: Qatar maroon and gold theme with glassmorphism effects
// 🌐 i18n: Arabic/English RTL/LTR support

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
  PanGestureHandler,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

// Import cart context and components
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { QatarColors, Spacing, Typography, ComponentStyles } from '../../styles/theme';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width;
const DRAWER_HEIGHT = height * 0.85;

// ================================
// CART DRAWER COMPONENT - Communication #60.6
// ================================
const CartDrawer = ({
  visible = false,
  onClose,
  onCheckout,
  style = {},
}) => {
  
  // ============================================================================
  // HOOKS & CONTEXT - Communication #60.6
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const {
    items,
    savedForLater,
    totalItems,
    totalPrice,
    formattedTotalWithCurrency,
    isEmpty,
    hasItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    isLoading,
    error,
    clearError,
  } = useCart();
  
  // ============================================================================
  // STATE & REFS - Communication #60.6
  // ============================================================================
  
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'saved'
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(height)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // ANIMATION EFFECTS - Communication #60.6
  // ============================================================================
  
  useEffect(() => {
    if (visible) {
      // Open drawer animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height - DRAWER_HEIGHT,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Content fade-in after drawer is visible
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Close drawer animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  // ============================================================================
  // EVENT HANDLERS - Communication #60.6
  // ============================================================================
  
  const handleClose = () => {
    console.log('🛒 Communication #60.6 - Closing cart drawer');
    if (onClose) {
      onClose();
    }
  };
  
  const handleClearCart = () => {
    const title = isRTL ? 'مسح السلة' : 'Clear Cart';
    const message = isRTL 
      ? `هل تريد حذف جميع العناصر (${totalItems}) من السلة؟`
      : `Remove all ${totalItems} items from your cart?`;
    const cancelText = isRTL ? 'إلغاء' : 'Cancel';
    const confirmText = isRTL ? 'مسح' : 'Clear';
    
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel' },
        { 
          text: confirmText, 
          style: 'destructive',
          onPress: () => {
            clearCart();
            console.log('🧹 Communication #60.6 - Cart cleared by user');
          }
        },
      ]
    );
  };
  
  const handleCheckout = () => {
    if (isEmpty) {
      return;
    }
    
    console.log(`💳 Communication #60.6 - Checkout initiated with ${totalItems} items (${formattedTotalWithCurrency})`);
    
    if (onCheckout) {
      onCheckout(items, totalPrice);
    } else {
      // Default checkout behavior
      const title = isRTL ? 'الخروج للدفع' : 'Checkout';
      const message = isRTL 
        ? `المتابعة للدفع بإجمالي ${formattedTotalWithCurrency}؟`
        : `Proceed to checkout with total ${formattedTotalWithCurrency}?`;
      const cancelText = isRTL ? 'إلغاء' : 'Cancel';
      const confirmText = isRTL ? 'متابعة' : 'Proceed';
      
      Alert.alert(
        title,
        message,
        [
          { text: cancelText, style: 'cancel' },
          { 
            text: confirmText,
            onPress: () => {
              // Handle checkout logic here
              Alert.alert(
                isRTL ? 'قريباً' : 'Coming Soon',
                isRTL ? 'ميزة الدفع قيد التطوير' : 'Checkout feature is under development'
              );
            }
          },
        ]
      );
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`📑 Communication #60.6 - Tab changed to: ${tab}`);
  };
  
  // ============================================================================
  // RENDER METHODS - Communication #60.6
  // ============================================================================
  
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.closeButtonText}>
          {isRTL ? '✕' : '✕'}
        </Text>
      </TouchableOpacity>
      
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {isRTL ? 'سلة التسوق' : 'Shopping Cart'}
        </Text>
        {hasItems && (
          <Text style={styles.itemCount}>
            {isRTL 
              ? `${totalItems} عنصر`
              : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
            }
          </Text>
        )}
      </View>
      
      {/* Clear Cart Button */}
      {hasItems && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Text style={styles.clearButtonText}>
            {isRTL ? 'مسح' : 'Clear'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'cart' && styles.activeTab,
        ]}
        onPress={() => handleTabChange('cart')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'cart' && styles.activeTabText,
        ]}>
          {isRTL ? `السلة (${items.length})` : `Cart (${items.length})`}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'saved' && styles.activeTab,
        ]}
        onPress={() => handleTabChange('saved')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'saved' && styles.activeTabText,
        ]}>
          {isRTL ? `محفوظ (${savedForLater.length})` : `Saved (${savedForLater.length})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderEmptyState = () => {
    const isCartEmpty = activeTab === 'cart' && isEmpty;
    const isSavedEmpty = activeTab === 'saved' && savedForLater.length === 0;
    
    if (!isCartEmpty && !isSavedEmpty) return null;
    
    const emptyIcon = activeTab === 'cart' ? '🛒' : '💾';
    const emptyTitle = activeTab === 'cart' 
      ? (isRTL ? 'السلة فارغة' : 'Cart is Empty')
      : (isRTL ? 'لا توجد عناصر محفوظة' : 'No Saved Items');
    const emptyMessage = activeTab === 'cart'
      ? (isRTL ? 'أضف بعض الكيكات اللذيذة إلى سلتك!' : 'Add some delicious cakes to your cart!')
      : (isRTL ? 'لم تحفظ أي عناصر بعد' : 'You haven\'t saved any items yet');
    
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>{emptyIcon}</Text>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  };
  
  const renderCartItems = () => {
    const dataToRender = activeTab === 'cart' ? items : savedForLater;
    const keyExtractor = (item) => `${activeTab}_${item.cartItemId}`;
    
    if (dataToRender.length === 0) {
      return renderEmptyState();
    }
    
    return (
      <FlatList
        data={dataToRender}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <CartItem
            item={item}
            index={index}
            isInSavedForLater={activeTab === 'saved'}
            onRemove={() => removeFromCart(item.cartItemId)}
            onUpdateQuantity={(quantity) => updateQuantity(item.cartItemId, quantity)}
            onSaveForLater={() => saveForLater(item.cartItemId)}
            onMoveToCart={() => moveToCart(item.cartItemId)}
            style={styles.cartItem}
          />
        )}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    );
  };
  
  const renderFooter = () => {
    if (activeTab === 'saved' || isEmpty) {
      return null;
    }
    
    return (
      <View style={styles.footer}>
        <CartSummary
          totalItems={totalItems}
          totalPrice={totalPrice}
          formattedTotal={formattedTotalWithCurrency}
          style={styles.cartSummary}
        />
        
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            isEmpty && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isEmpty}
        >
          <LinearGradient
            colors={[QatarColors.secondary, QatarColors.secondaryDark]}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutButtonText}>
              {isRTL ? `الدفع • ${formattedTotalWithCurrency}` : `Checkout • ${formattedTotalWithCurrency}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={clearError}
        >
          <Text style={styles.errorButtonText}>
            {isRTL ? 'موافق' : 'Dismiss'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // ============================================================================
  // MAIN RENDER - Communication #60.6
  // ============================================================================
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* Cart Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateY: slideAnim }],
          },
          style,
        ]}
      >
        <LinearGradient
          colors={[QatarColors.surface, QatarColors.surfaceLight]}
          style={styles.drawerGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: contentOpacity,
                },
              ]}
            >
              {/* Header */}
              {renderHeader()}
              
              {/* Error State */}
              {renderErrorState()}
              
              {/* Tabs */}
              {renderTabs()}
              
              {/* Cart Items */}
              <View style={styles.itemsContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      {isRTL ? 'جاري التحميل...' : 'Loading...'}
                    </Text>
                  </View>
                ) : (
                  renderCartItems()
                )}
              </View>
              
              {/* Footer */}
              {renderFooter()}
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

// ============================================================================
// STYLES - Communication #60.6
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  overlayTouchable: {
    flex: 1,
  },
  
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  
  drawerGradient: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },
  
  content: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: QatarColors.border || 'rgba(255, 255, 255, 0.1)',
  },
  
  closeButton: {
    padding: Spacing.sm,
  },
  
  closeButtonText: {
    fontSize: Typography.fontSize.xl,
    color: QatarColors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  itemCount: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginTop: 2,
  },
  
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    backgroundColor: QatarColors.error,
  },
  
  clearButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textOnPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  
  activeTab: {
    borderBottomColor: QatarColors.secondary,
  },
  
  tabText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  activeTabText: {
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Items Container
  itemsContainer: {
    flex: 1,
  },
  
  itemsList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  cartItem: {
    marginBottom: Spacing.md,
  },
  
  itemSeparator: {
    height: Spacing.sm,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  
  emptyMessage: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.md * 1.5,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    marginTop: Spacing.md,
  },
  
  // Error State
  errorContainer: {
    backgroundColor: QatarColors.error,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  errorText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textOnPrimary,
    marginRight: Spacing.md,
  },
  
  errorButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  errorButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textOnPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Footer Styles
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: QatarColors.border || 'rgba(255, 255, 255, 0.1)',
  },
  
  cartSummary: {
    marginBottom: Spacing.lg,
  },
  
  checkoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  
  checkoutGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  
  checkoutButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
});

export default CartDrawer;
