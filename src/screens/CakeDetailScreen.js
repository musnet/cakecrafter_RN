// src/screens/CakeDetailScreen.js - Communication #60.6: RICH Product Detail Experience
// 🍰 PREMIUM: Ultra-rich UI/UX product detail screen with Qatar luxury design
// 🛒 CART: Complete integration with existing cart system
// 🎨 LUXURY: Premium animations, gestures, and visual effects
// 🌐 i18n: Full Arabic/English RTL support
// ⚡ PERFORMANCE: Optimized for smooth 60fps interactions
// 🇶🇦 QATAR: Heritage design with maroon and gold luxury branding

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Alert,
  Share,
  Modal,
  FlatList,
  ImageBackground,
  Platform,
  StatusBar,
  PanGestureHandler,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

// Import context and styling
import { useCart } from '../context/CartContext';
import { QatarColors, Spacing, Typography, ComponentStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.45;
const HEADER_HEIGHT = 90;

// ================================
// RICH CAKE DETAIL SCREEN - Communication #60.6
// ================================
const CakeDetailScreen = ({ navigation, route }) => {
  
  // ============================================================================
  // PROPS & NAVIGATION
  // ============================================================================
  
  const { cakeData } = route.params || {};
  
  if (!cakeData) {
    useEffect(() => {
      Alert.alert(
        'Error',
        'Product information not found',
        [{ text: 'Go Back', onPress: () => navigation.goBack() }]
      );
    }, []);
    return null;
  }

  // ============================================================================
  // HOOKS & CONTEXT
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const {
    addToCart,
    totalItems,
    setCartVisible,
  } = useCart();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const addToCartScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const displayName = isRTL && cakeData.nameAr ? cakeData.nameAr : cakeData.name;
  const basePrice = typeof cakeData.price === 'number' ? cakeData.price : parseFloat(cakeData.price?.toString().replace(/[^\d.]/g, '') || '250');
  
  // Size multipliers for dynamic pricing
  const sizeMultipliers = {
    small: 0.8,
    medium: 1.0,
    large: 1.4,
    custom: 2.0
  };
  
  const calculatedPrice = basePrice * sizeMultipliers[selectedSize] * quantity;
  const formattedPrice = `QAR ${calculatedPrice.toFixed(2)}`;

  // Mock images for gallery (in production, this would come from cakeData.images array)
  const cakeImages = [
    cakeData.image,
    cakeData.image,
    cakeData.image,
  ];

  // Mock nutrition data
  const nutritionInfo = {
    calories: 350,
    fat: '15g',
    carbs: '45g',
    protein: '5g',
    sugar: '35g',
    sodium: '200mg'
  };

  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: 'Ahmed Al-Mansouri',
      nameAr: 'أحمد المنصوري',
      rating: 5,
      comment: 'Absolutely delicious! Perfect for our celebration.',
      commentAr: 'لذيذ جداً! مثالي لاحتفالنا.',
      date: '2025-08-05'
    },
    {
      id: 2,
      name: 'Fatima Hassan',
      nameAr: 'فاطمة حسن',
      rating: 4,
      comment: 'Beautiful presentation and great taste.',
      commentAr: 'عرض جميل وطعم رائع.',
      date: '2025-08-01'
    }
  ];

  // ============================================================================
  // ANIMATION EFFECTS
  // ============================================================================
  
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Header opacity based on scroll
  const headerOpacityInterpolated = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScaleInterpolated = scrollY.interpolate({
    inputRange: [-100, 0, IMAGE_HEIGHT],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      // Haptic feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate();
      }
      
      // Animate button
      Animated.sequence([
        Animated.timing(addToCartScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(addToCartScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      // Prepare cart item
      const cartItem = {
        id: `${cakeData.id}_${selectedSize}_${Date.now()}`,
        name: displayName,
        price: calculatedPrice,
        image: cakeData.image,
        size: selectedSize,
        quantity: quantity,
        category: cakeData.category || 'custom',
        originalPrice: basePrice,
      };

      // Add to cart
      await addToCart(cartItem, quantity, true);
      
      console.log(`🛒 Communication #60.6 - Added to cart: ${displayName} (${quantity}x ${selectedSize})`);
      
      // Success feedback
      Alert.alert(
        isRTL ? '✅ تمت الإضافة للسلة' : '✅ Added to Cart',
        isRTL 
          ? `تم إضافة ${displayName} إلى سلة التسوق بنجاح`
          : `${displayName} has been successfully added to your cart`,
        [
          { text: isRTL ? 'متابعة التسوق' : 'Continue Shopping' },
          { 
            text: isRTL ? 'عرض السلة' : 'View Cart', 
            onPress: () => setCartVisible(true) 
          }
        ]
      );

    } catch (error) {
      console.error('❌ Communication #60.6 - Add to cart error:', error);
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'فشل في إضافة العنصر للسلة' : 'Failed to add item to cart'
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuickCheckout = () => {
    handleAddToCart().then(() => {
      setShowCheckoutModal(true);
    });
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        title: displayName,
        message: isRTL 
          ? `شاهد هذه الكيكة الرائعة: ${displayName} - ${formattedPrice}`
          : `Check out this amazing cake: ${displayName} - ${formattedPrice}`,
        url: 'https://cakecrafter.ai/cakes/' + cakeData.id,
      };

      await Share.share(shareContent);
    } catch (error) {
      console.error('❌ Communication #60.6 - Share error:', error);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // Animate size change
    Animated.spring(addToCartScale, {
      toValue: 1.05,
      friction: 4,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(addToCartScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    Animated.spring(heartScale, {
      toValue: isFavorite ? 1 : 1.2,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderAnimatedHeader = () => (
    <Animated.View style={[styles.animatedHeader, { opacity: headerOpacityInterpolated }]}>
      <LinearGradient
        colors={['#8B1538', '#6B1028']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.headerButtonText}>
                {isRTL ? '→' : '←'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              {displayName}
            </Text>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Text style={styles.headerButtonText}>⤴️</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );

  const renderHeroImageSection = () => (
    <Animated.View style={[styles.imageContainer, { height: IMAGE_HEIGHT }]}>
      <Animated.View 
        style={[
          styles.imageWrapper, 
          { 
            transform: [
              { scale: imageScaleInterpolated },
              { scale: imageScale }
            ] 
          }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setShowImageModal(true)}
        >
          <Image 
            source={{ uri: cakeImages[selectedImageIndex] }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradientOverlay}
          />
          
          {/* Floating elements */}
          <View style={styles.floatingElements}>
            {/* New badge */}
            {cakeData.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>
                  {isRTL ? 'جديد' : 'NEW'}
                </Text>
              </View>
            )}
            
            {/* Rating badge */}
            <View style={styles.ratingBadgeContainer}>
              <BlurView intensity={80} tint="dark" style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ⭐ {cakeData.rating || 4.8}
                </Text>
              </BlurView>
            </View>
            
            {/* Zoom hint */}
            <View style={styles.zoomHintContainer}>
              <BlurView intensity={60} tint="dark" style={styles.zoomHint}>
                <Text style={styles.zoomHintText}>
                  {isRTL ? 'اضغط للتكبير' : 'Tap to zoom'}
                </Text>
              </BlurView>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Image indicators */}
      {cakeImages.length > 1 && (
        <View style={styles.imageIndicators}>
          {cakeImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                selectedImageIndex === index && styles.activeIndicator
              ]}
              onPress={() => setSelectedImageIndex(index)}
            />
          ))}
        </View>
      )}

      {/* Back and favorite buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity 
          style={styles.topButton}
          onPress={() => navigation.goBack()}
        >
          <BlurView intensity={80} tint="dark" style={styles.topButtonBlur}>
            <Text style={styles.topButtonText}>
              {isRTL ? '→' : '←'}
            </Text>
          </BlurView>
        </TouchableOpacity>
        
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <TouchableOpacity 
            style={styles.topButton}
            onPress={handleFavoriteToggle}
          >
            <BlurView intensity={80} tint="dark" style={styles.topButtonBlur}>
              <Text style={styles.topButtonText}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderProductInfo = () => (
    <Animated.View style={[styles.productInfoContainer, { opacity: fadeAnim }]}>
      <View style={styles.productHeader}>
        <View style={styles.productTitleSection}>
          <Text style={styles.productName}>{displayName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>
              {'⭐'.repeat(Math.floor(cakeData.rating || 5))}
            </Text>
            <Text style={styles.ratingText}>
              {cakeData.rating || 5.0} • {cakeData.purchases || 50}+ {isRTL ? 'طلب' : 'orders'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.shareButtonGradient}
          >
            <Text style={styles.shareButtonText}>⤴️</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.productPrice}>{formattedPrice}</Text>
      
      {cakeData.description && (
        <Text style={styles.productDescription}>
          {isRTL && cakeData.descriptionAr ? cakeData.descriptionAr : cakeData.description}
        </Text>
      )}
    </Animated.View>
  );

  const renderSizeSelector = () => (
    <View style={styles.sizeSelector}>
      <Text style={styles.sectionTitle}>
        {isRTL ? 'اختر الحجم' : 'Select Size'}
      </Text>
      
      <View style={styles.sizeOptions}>
        {Object.keys(sizeMultipliers).map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeOption,
              selectedSize === size && styles.selectedSizeOption
            ]}
            onPress={() => handleSizeChange(size)}
          >
            <LinearGradient
              colors={
                selectedSize === size 
                  ? ['#8B1538', '#6B1028']
                  : ['#F8F9FA', '#FFFFFF']
              }
              style={styles.sizeOptionGradient}
            >
              <Text style={[
                styles.sizeOptionText,
                selectedSize === size && styles.selectedSizeOptionText
              ]}>
                {isRTL ? 
                  (size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : size === 'large' ? 'كبير' : 'مخصص') :
                  size.charAt(0).toUpperCase() + size.slice(1)
                }
              </Text>
              <Text style={[
                styles.sizePrice,
                selectedSize === size && styles.selectedSizePrice
              ]}>
                QAR {(basePrice * sizeMultipliers[size]).toFixed(2)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantitySelector}>
      <Text style={styles.sectionTitle}>
        {isRTL ? 'الكمية' : 'Quantity'}
      </Text>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <LinearGradient
            colors={quantity <= 1 ? ['#E0E0E0', '#CCCCCC'] : ['#8B1538', '#6B1028']}
            style={styles.quantityButtonGradient}
          >
            <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>−</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.quantityButton, quantity >= 10 && styles.quantityButtonDisabled]}
          onPress={() => handleQuantityChange(1)}
          disabled={quantity >= 10}
        >
          <LinearGradient
            colors={quantity >= 10 ? ['#E0E0E0', '#CCCCCC'] : ['#8B1538', '#6B1028']}
            style={styles.quantityButtonGradient}
          >
            <Text style={[styles.quantityButtonText, quantity >= 10 && styles.quantityButtonTextDisabled]}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <View style={styles.infoButtonsRow}>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowNutritionModal(true)}
        >
          <LinearGradient
            colors={['#F8F9FA', '#FFFFFF']}
            style={styles.infoButtonGradient}
          >
            <Text style={styles.infoButtonEmoji}>🥗</Text>
            <Text style={styles.infoButtonText}>
              {isRTL ? 'معلومات غذائية' : 'Nutrition'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowReviewsModal(true)}
        >
          <LinearGradient
            colors={['#F8F9FA', '#FFFFFF']}
            style={styles.infoButtonGradient}
          >
            <Text style={styles.infoButtonEmoji}>⭐</Text>
            <Text style={styles.infoButtonText}>
              {isRTL ? 'التقييمات' : 'Reviews'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.cartButtonsRow}>
        <Animated.View style={[styles.addToCartContainer, { transform: [{ scale: addToCartScale }] }]}>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            disabled={isAddingToCart}
          >
            <LinearGradient
              colors={isAddingToCart ? ['#999999', '#777777'] : ['#8B1538', '#6B1028']}
              style={styles.addToCartGradient}
            >
              <Text style={styles.addToCartText}>
                {isAddingToCart ? 
                  (isRTL ? 'جاري الإضافة...' : 'Adding...') :
                  (isRTL ? '🛒 أضف للسلة' : '🛒 Add to Cart')
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.quickBuyButton}
          onPress={handleQuickCheckout}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.quickBuyGradient}
          >
            <Text style={styles.quickBuyText}>
              {isRTL ? '⚡ شراء سريع' : '⚡ Quick Buy'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated header */}
      {renderAnimatedHeader()}

      {/* Main content */}
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderHeroImageSection()}
        
        <View style={styles.contentContainer}>
          {renderProductInfo()}
          {renderSizeSelector()}
          {renderQuantitySelector()}
          {renderActionButtons()}
          
          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </Animated.ScrollView>

      {/* Modals - Simple versions for now */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          >
            <Image 
              source={{ uri: cakeImages[selectedImageIndex] }} 
              style={styles.modalImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// ================================
// RICH STYLES - Communication #60.6
// ================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Animated Header
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: HEADER_HEIGHT,
  },

  headerGradient: {
    flex: 1,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: HEADER_HEIGHT,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 16,
  },

  // Hero Image Section
  imageContainer: {
    position: 'relative',
    backgroundColor: '#000',
  },

  imageWrapper: {
    flex: 1,
  },

  heroImage: {
    width: width,
    height: IMAGE_HEIGHT,
  },

  imageGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },

  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  newBadge: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  newBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B1538',
  },

  ratingBadgeContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },

  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  zoomHintContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },

  zoomHint: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },

  zoomHintText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },

  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },

  activeIndicator: {
    backgroundColor: '#FFD700',
    width: 20,
  },

  topButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },

  topButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Content Container
  scrollView: {
    flex: 1,
  },

  contentContainer: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    minHeight: height - IMAGE_HEIGHT + 50,
  },

  // Product Info
  productInfoContainer: {
    marginBottom: 30,
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  productTitleSection: {
    flex: 1,
  },

  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 34,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  ratingStars: {
    fontSize: 16,
    marginRight: 8,
  },

  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  shareButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 16,
  },

  productDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
    marginBottom: 20,
  },

  // Section Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },

  // Size Selector
  sizeSelector: {
    marginBottom: 30,
  },

  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sizeOption: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  sizeOptionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
  },

  selectedSizeOption: {
    elevation: 6,
  },

  sizeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },

  selectedSizeOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  sizePrice: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },

  selectedSizePrice: {
    color: '#FFD700',
    fontWeight: 'bold',
  },

  // Quantity Selector
  quantitySelector: {
    marginBottom: 30,
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  quantityButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonDisabled: {
    elevation: 1,
  },

  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  quantityButtonTextDisabled: {
    color: '#999999',
  },

  quantityDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    minWidth: 40,
  },

  // Action Buttons
  actionButtonsContainer: {
    marginBottom: 30,
  },

  infoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  infoButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  infoButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  infoButtonEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },

  infoButtonText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'center',
  },

  cartButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  addToCartContainer: {
    flex: 2,
    marginRight: 12,
  },

  addToCartButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B1538',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  addToCartGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addToCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  quickBuyButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  quickBuyGradient: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickBuyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B1538',
    textAlign: 'center',
  },

  bottomSpacing: {
    height: 50,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
  },

  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CakeDetailScreen;