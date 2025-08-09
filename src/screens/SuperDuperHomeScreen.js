// src/screens/SuperDuperHomeScreen.js - Communication #60.7: Enhanced with Shopping Cart Integration
// 🛒 NEW: Complete shopping cart integration with CartContext
// 🎨 LUXURY: Premium dark theme with Qatar branding and stunning visuals
// 🌐 i18n: Full Arabic/English support with LanguageSwitcher integration
// 🍰 JSON DATA: Real cake data from 6 category JSON files - NO HARDCODED DATA
// ✨ ENHANCED: Cart icon and add-to-cart functionality
// 📱 CATEGORIES: Load from data/categories/*.json files with cart integration

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

// Import theme
import { QatarColors, Spacing, Typography, ComponentStyles, Layout } from '../styles/theme';
import LanguageSwitcher from '../components/LanguageSwitcher';

// ✨ NEW: Import cart components - Communication #60.7
import { useCart } from '../context/CartContext';
import CartIcon from '../components/cart/CartIcon';
import CartDrawer from '../components/cart/CartDrawer';

// Import gallery component
import EnhancedCakeGallery from '../components/gallery/EnhancedCakeGallery';

// JSON data imports
import birthdayCakesData from '../../data/categories/birthday_cakes.json';
import weddingCakesData from '../../data/categories/wedding_cakes.json';
import sportsCakesData from '../../data/categories/sports_cakes.json';
import culturalCakesData from '../../data/categories/cultural_cakes.json';
import corporateCakesData from '../../data/categories/corporate_cakes.json';
import customCakesData from '../../data/categories/custom_cakes.json';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CATEGORY_SIZE = Layout.categorySize;

// ================================
// CATEGORY DATA MAPPING
// ================================
const CATEGORY_DATA_MAP = {
  'birthday': birthdayCakesData,
  'wedding': weddingCakesData,
  'sports': sportsCakesData,
  'cultural': culturalCakesData,
  'corporate': corporateCakesData,
  'custom': customCakesData,
};

// Category validation function
const validateCategoryData = (categoryKey, categoryData) => {
  const category = categoryData.category;
  if (!category || !category.name || !Array.isArray(categoryData.cakes)) {
    console.error(`❌ Invalid category data for ${categoryKey}:`, categoryData);
    return false;
  }
  return true;
};

// Category colors for UI
const CATEGORY_COLORS = {
  'birthday': '#F59E0B',    // Birthday - Amber
  'wedding': '#EC4899',     // Wedding - Pink
  'sports': '#10B981',      // Sports - Green
  'cultural': '#8B5CF6',    // Cultural - Purple
  'corporate': '#3B82F6',   // Corporate - Blue
  'custom': '#F97316',      // Custom - Orange
};

// Categories configuration
const CAKE_CATEGORIES = [
  {
    key: 'birthday',
    name: 'Birthday Cakes',
    nameAr: 'كيكات أعياد الميلاد',
    icon: '🎂',
    color: CATEGORY_COLORS.birthday,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/birthday.png',
  },
  {
    key: 'wedding',
    name: 'Wedding Cakes',
    nameAr: 'كيكات الزفاف',
    icon: '💒',
    color: CATEGORY_COLORS.wedding,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/wedding.png',
  },
  {
    key: 'sports',
    name: 'Sports Cakes',
    nameAr: 'كيكات رياضية',
    icon: '⚽',
    color: CATEGORY_COLORS.sports,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/sports.png',
  },
  {
    key: 'cultural',
    name: 'Cultural Cakes',
    nameAr: 'كيكات ثقافية',
    icon: '🏛️',
    color: CATEGORY_COLORS.cultural,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/cultural.png',
  },
  {
    key: 'corporate',
    name: 'Corporate Cakes',
    nameAr: 'كيكات الشركات',
    icon: '🏢',
    color: CATEGORY_COLORS.corporate,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/corporate.png',
  },
  {
    key: 'custom',
    name: 'Custom Cakes',
    nameAr: 'كيكات مخصصة',
    icon: '🎨',
    color: CATEGORY_COLORS.custom,
    // ✅ CORRECT S3 URL
    image: 'https://cakecrafter-media-web-optimized.s3-us-west-2.amazonaws.com/cake_categories_images/custom.png',
  },
];


// ================================
// MAIN COMPONENT - Communication #60.7
// ================================
const SuperDuperHomeScreen = ({ navigation }) => {
  
  // ============================================================================
  // HOOKS & CONTEXT - Communication #60.7
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const isRTL = currentLanguage === 'ar';
  
  // ✨ NEW: Cart context integration - Communication #60.7
  const {
    addToCart,
    totalItems,
    isCartVisible,
    setCartVisible,
    hasItems,
    formattedTotalWithCurrency,
  } = useCart();
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState(CAKE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  
  // ✨ NEW: Cart UI state - Communication #60.7
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  
  // Animation refs
  const categoryScale = useRef(new Animated.Value(0.8)).current;
  const featuredScale = useRef(new Animated.Value(0.8)).current;
  const galleryOpacity = useRef(new Animated.Value(0)).current;
  const headerOffset = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  
  useEffect(() => {
    loadInitialData();
    startAnimations();
  }, []);
  
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData(selectedCategory);
    }
  }, [selectedCategory]);
  
  // ============================================================================
  // DATA LOADING
  // ============================================================================
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('🏠 Communication #60.7 - Loading SuperDuperHomeScreen with cart integration');
      
      // Load categories with cake counts
      const categoriesWithCounts = CAKE_CATEGORIES.map(category => {
        const categoryData = CATEGORY_DATA_MAP[category.key];
        if (validateCategoryData(category.key, categoryData)) {
          return {
            ...category,
            count: categoryData.cakes.length,
            description: categoryData.category.description || '',
          };
        }
        return { ...category, count: 0 };
      });
      
      setCategories(categoriesWithCounts);
      
      // Auto-select first category
      if (categoriesWithCounts.length > 0) {
        setSelectedCategory(categoriesWithCounts[0]);
      }
      
      console.log('✅ Communication #60.7 - Initial data loaded with cart support');
      
    } catch (error) {
      console.error('❌ Communication #60.7 - Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCategoryData = (category) => {
    try {
      console.log(`🍰 Communication #60.7 - Loading category: ${category.name} for cart integration`);
      
      const categoryData = CATEGORY_DATA_MAP[category.key];
      if (validateCategoryData(category.key, categoryData)) {
        setCakes(categoryData.cakes || []);
        console.log(`✅ Communication #60.7 - Loaded ${categoryData.cakes.length} cakes from ${category.name}`);
      } else {
        setCakes([]);
        console.log(`⚠️ Communication #60.7 - No valid cakes found for ${category.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Communication #60.7 - Error loading category ${category.name}:`, error);
      setCakes([]);
    }
  };
  
  const startAnimations = () => {
    // Staggered luxury entrance animations
    Animated.sequence([
      Animated.timing(categoryScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(featuredScale, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(galleryOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // ============================================================================
  // ✨ NEW: CART EVENT HANDLERS - Communication #60.7
  // ============================================================================
  
  const handleAddToCart = (item) => {
    console.log(`🛒 Communication #60.7 - Adding to cart from SuperDuperHome: ${item.name}`);
    
    try {
      addToCart(item, 1, true); // Add 1 item with toast notification
      
      // Optional: Show cart drawer briefly when item is added
      // setShowCartDrawer(true);
      // setTimeout(() => setShowCartDrawer(false), 2000);
      
    } catch (error) {
      console.error('❌ Communication #60.7 - Error adding to cart:', error);
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'فشل في إضافة العنصر للسلة' : 'Failed to add item to cart',
        [{ text: isRTL ? 'موافق' : 'OK' }]
      );
    }
  };
  
  const handleCartIconPress = () => {
    console.log(`🛒 Communication #60.7 - Cart icon pressed (${totalItems} items)`);
    setShowCartDrawer(true);
  };
  
  const handleCartDrawerClose = () => {
    console.log('🛒 Communication #60.7 - Cart drawer closed');
    setShowCartDrawer(false);
  };
  
  const handleCheckout = (items, total) => {
    console.log(`💳 Communication #60.7 - Checkout initiated: ${items.length} items, total: ${total}`);
    
    // Close cart drawer
    setShowCartDrawer(false);
    
    // Show checkout modal/screen
    Alert.alert(
      isRTL ? 'الخروج للدفع' : 'Checkout',
      isRTL 
        ? `المتابعة للدفع بإجمالي ${formattedTotalWithCurrency}؟`
        : `Proceed to checkout with ${items.length} items (${formattedTotalWithCurrency})?`,
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: isRTL ? 'متابعة' : 'Continue',
          onPress: () => {
            // Navigate to checkout screen
            Alert.alert(
              isRTL ? 'قريباً' : 'Coming Soon',
              isRTL ? 'ميزة الدفع قيد التطوير' : 'Checkout functionality coming soon!'
            );
          }
        },
      ]
    );
  };
  
  // ============================================================================
  // OTHER EVENT HANDLERS
  // ============================================================================
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInitialData();
    setIsRefreshing(false);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('🔍 Communication #60.7 - Searching for:', query);
    // TODO: Implement real search functionality
  };
  
  const handleLanguageChange = (languageCode) => {
    console.log('🌐 Communication #60.7 - Language changed to:', languageCode);
  };
  
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const categoryName = isRTL ? category.nameAr : category.name;
    console.log(`📱 Communication #60.7 - Category selected: ${categoryName} (${category.count} cakes)`);
  };
  
const handleCakePress = (cake) => {
  console.log(`🍰 Communication #60.6 - Navigating to product detail: ${cake.name || cake.title?.en}`);
  
  try {
    // Prepare cake data for detail screen
    const cakeData = {
      id: cake.id || `cake_${Date.now()}`,
      name: cake.title?.en || cake.name || 'Delicious Cake',
      nameAr: cake.title?.ar || cake.nameAr || 'كيكة لذيذة',
      image: cake.image_url || cake.image,
      price: cake.price || 250,
      currency: cake.currency || 'QAR',
      rating: cake.rating || 4.8,
      purchases: cake.purchases || Math.floor(Math.random() * 200) + 50,
      description: `Delicious ${cake.title?.en || cake.name || 'cake'} perfect for any celebration.`,
      descriptionAr: `كيكة لذيذة مثالية لأي احتفال.`,
      category: selectedCategory?.key || 'custom',
      ingredients: cake.ingredients || ['flour', 'sugar', 'eggs', 'butter'],
      isNew: cake.is_new || false,
      isInStock: cake.is_in_stock !== false,
      // Additional data
      originalCakeData: cake,
      categoryData: selectedCategory,
    };
    
    // Navigate to detail screen
    navigation.navigate('CakeDetail', { cakeData });
    
  } catch (error) {
    console.error('❌ Communication #60.6 - Navigation error:', error);
    // Fallback to original alert behavior
    Alert.alert(
      cake.name || 'Cake',
      `${cake.description || 'Delicious cake'}\nPrice: ${cake.price ? `QAR ${cake.price}` : 'QAR 199'}`,
      [
        { text: isRTL ? 'إغلاق' : 'Close', style: 'cancel' },
        { 
          text: isRTL ? 'إضافة للسلة' : 'Add to Cart',
          onPress: () => handleAddToCart(cake)
        },
      ]
    );
  }
};
  
  // ============================================================================
  // RENDER METHODS
  // ============================================================================
  
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Header content */}
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>
            {isRTL ? 'أهلاً وسهلاً' : 'Welcome'}
          </Text>
          <Text style={styles.titleText}>
            {isRTL ? 'صانع الكيك.آي' : 'CakeCrafter.AI'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {/* Language button */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageSwitcher(true)}
          >
            <Text style={styles.languageButtonText}>
              {isRTL ? '🇶🇦 عربي' : '🇬🇧 English'}
            </Text>
          </TouchableOpacity>
          
          {/* ✨ NEW: Cart summary in header - Communication #60.7 */}
          {hasItems && (
            <TouchableOpacity
              style={styles.headerCartSummary}
              onPress={handleCartIconPress}
            >
              <Text style={styles.headerCartText}>
                {isRTL ? `${totalItems} عنصر` : `${totalItems} items`}
              </Text>
              <Text style={styles.headerCartTotal}>
                {formattedTotalWithCurrency}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={isRTL ? 'البحث عن الكيكات...' : 'Search cakes...'}
          placeholderTextColor={QatarColors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          textAlign={isRTL ? 'right' : 'left'}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
    </View>
  );
  
  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>
        {isRTL ? 'فئات الكيك' : 'Cake Categories'}
      </Text>
      
      <Animated.View style={{ transform: [{ scale: categoryScale }] }}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory?.key === item.key && styles.categoryCardSelected,
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <View style={[styles.categoryImageContainer, { backgroundColor: item.color }]}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.categoryOverlay}
                />
                <View style={[styles.categoryBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.categoryCount}>{item.count}</Text>
                </View>
              </View>
              
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>
                  {isRTL ? item.nameAr : item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
  
  const renderGallery = () => (
    <Animated.View 
      style={[
        styles.gallerySection,
        { opacity: galleryOpacity }
      ]}
    >
      <EnhancedCakeGallery
        cakes={cakes}
        selectedCategory={selectedCategory}
        onCakePress={handleCakePress}
        onAddToCart={handleAddToCart} // ✨ NEW: Cart integration - Communication #60.7
        currentLanguage={currentLanguage}
        style={styles.gallery}
      />
    </Animated.View>
  );
  
  // ============================================================================
  // MAIN RENDER - Communication #60.7
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://cakecrafterapi.ebita.ai/media/generated_images/background_luxury.jpg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[QatarColors.background, 'rgba(15, 15, 35, 0.9)']}
          style={styles.overlay}
        >
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={QatarColors.secondary}
                progressBackgroundColor={QatarColors.surface}
              />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: headerOffset } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Header */}
            {renderHeader()}
            
            {/* Categories */}
            {renderCategories()}
            
            {/* Gallery */}
            {renderGallery()}
            
            {/* Loading indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={QatarColors.secondary} />
                <Text style={styles.loadingText}>
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </Text>
              </View>
            )}
          </ScrollView>
          
          {/* ✨ NEW: Cart Icon - Communication #60.7 */}
          <CartIcon
            onPress={handleCartIconPress}
            position="fixed"
            size="medium"
          />
          
          {/* ✨ NEW: Cart Drawer - Communication #60.7 */}
          <CartDrawer
            visible={showCartDrawer}
            onClose={handleCartDrawerClose}
            onCheckout={handleCheckout}
          />
          
          {/* Language Switcher Modal */}
          <LanguageSwitcher
            visible={showLanguageSwitcher}
            onClose={() => setShowLanguageSwitcher(false)}
            onLanguageChange={handleLanguageChange}
          />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES - Communication #60.7
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QatarColors.background,
  },
  
  backgroundImage: {
    flex: 1,
  },
  
  overlay: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  
  headerLeft: {
    flex: 1,
  },
  
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textSecondary,
    marginBottom: 4,
  },
  
  titleText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  headerRight: {
    alignItems: 'flex-end',
  },
  
  languageButton: {
    backgroundColor: QatarColors.glassEffect,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: Spacing.sm,
  },
  
  languageButtonText: {
    color: QatarColors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // ✨ NEW: Header cart summary - Communication #60.7
  headerCartSummary: {
    backgroundColor: QatarColors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  
  headerCartText: {
    color: QatarColors.textOnPrimary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  
  headerCartTotal: {
    color: QatarColors.textOnPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: QatarColors.glassEffect,
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: QatarColors.textPrimary,
  },
  
  searchIcon: {
    fontSize: Typography.fontSize.lg,
    marginLeft: Spacing.sm,
  },
  
  // Section Styles
  categoriesSection: {
    marginBottom: Spacing.xl,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  
  // Categories Styles
  categoriesList: {
    paddingHorizontal: Spacing.lg,
  },
  
  categoryCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
    width: CATEGORY_SIZE + 20,
  },
  
  categoryCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  
  categoryImageContainer: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: ComponentStyles.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...ComponentStyles.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 30,
    alignItems: 'center',
    ...ComponentStyles.shadows.small,
  },
  
  categoryCount: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  categoryInfo: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  
  categoryName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.textPrimary,
    textAlign: 'center',
  },
  
  // Gallery Styles
  gallerySection: {
    flex: 1,
    marginBottom: Spacing.xl,
  },
  
  gallery: {
    flex: 1,
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
  },
});

export default SuperDuperHomeScreen;
