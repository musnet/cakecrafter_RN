// src/screens/SuperDuperHomeScreen.js - Communication #60.2: Enhanced with Production Categories
// 🎨 LUXURY: Premium dark theme with Qatar branding and stunning visuals
// 🌐 i18n: Full Arabic/English support with LanguageSwitcher integration
// 🍰 PRODUCTION: Real cake data from CakeCrafter backend API + Enhanced Categories
// ✨ ENHANCED: Advanced masonry gallery with infinite scrolling and beautiful animations
// 📱 CATEGORIES: Horizontal scrollable categories with production images

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

// Import services and theme
import { ApiService } from '../services/ApiService';
import { QatarColors, Spacing, Typography, ComponentStyles, Layout } from '../styles/theme';
import LanguageSwitcher from '../components/LanguageSwitcher';

// ✨ NEW: Import enhanced gallery components
import EnhancedCakeGallery from '../components/gallery/EnhancedCakeGallery';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CATEGORY_SIZE = Layout.categorySize;

// ================================
// PRODUCTION IMAGE CONFIGURATION
// ================================
const PRODUCTION_IMAGES = {
  baseUrl: 'https://cakecrafterapi.ebita.ai/media/generated_images/',
  categoriesUrl: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/',
};

// 🌟 Gallery Images (Selection from production server)
const GALLERY_IMAGES = [
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (1).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (5).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (12).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (18).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (25).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (33).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (41).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}Cake_imaes199993 (55).jpg`,
  `${PRODUCTION_IMAGES.baseUrl}guest_freecakie_20250807_001426_439c6623.jpg`,
  `${PRODUCTION_IMAGES.baseUrl}guest_openai_20250805_182133_08d12f7e.jpg`,
  `${PRODUCTION_IMAGES.baseUrl}sample_cake_birthday_5330.jpg`,
  `${PRODUCTION_IMAGES.baseUrl}sample_cake_wedding_6511.jpg`,
];

// ================================
// ✨ NEW: PRODUCTION CAKE CATEGORIES
// ================================
const CAKE_CATEGORIES = [
  {
    id: 1,
    name: 'Sports',
    nameAr: 'رياضة',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/sports.png',
    color: '#FF6B35',
    count: 25,
    description: 'Sports themed cakes',
    descriptionAr: 'كيكات بتصاميم رياضية',
  },
  {
    id: 2,
    name: 'Custom',
    nameAr: 'مخصص',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/custom.png',
    color: '#8B5CF6',
    count: 45,
    description: 'Custom designed cakes',
    descriptionAr: 'كيكات مصممة خصيصاً',
  },
  {
    id: 3,
    name: 'Corporate',
    nameAr: 'شركات',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/corporate.png',
    color: '#3B82F6',
    count: 18,
    description: 'Corporate event cakes',
    descriptionAr: 'كيكات المناسبات الشركات',
  },
  {
    id: 4,
    name: 'Birthday',
    nameAr: 'أعياد ميلاد',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/birthday.png',
    color: '#F59E0B',
    count: 67,
    description: 'Birthday celebration cakes',
    descriptionAr: 'كيكات أعياد الميلاد',
  },
  {
    id: 5,
    name: 'Wedding',
    nameAr: 'زفاف',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/wedding.png',
    color: '#EC4899',
    count: 32,
    description: 'Wedding celebration cakes',
    descriptionAr: 'كيكات الزفاف',
  },
  {
    id: 6,
    name: 'Cultural',
    nameAr: 'ثقافي',
    image: 'https://cakecrafterapi.ebita.ai/media/cake_categories_images/cultural.png',
    color: '#10B981',
    count: 23,
    description: 'Cultural celebration cakes',
    descriptionAr: 'كيكات المناسبات الثقافية',
  },
];

// ================================
// LUXURY SUPERDUPERHOMESCREEN COMPONENT
// ================================
const SuperDuperHomeScreen = ({ navigation }) => {
  
  // ============================================================================
  // HOOKS & STATE MANAGEMENT
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState(CAKE_CATEGORIES); // ✨ NEW: Use production categories
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [userName, setUserName] = useState('');
  
  // Animation Values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(Layout.headerHeight)).current;
  const searchScale = useRef(new Animated.Value(1)).current;
  const categoryScale = useRef(new Animated.Value(0)).current;
  const featuredScale = useRef(new Animated.Value(0)).current;
  const galleryOpacity = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // LIFECYCLE & EFFECTS
  // ============================================================================
  
  useEffect(() => {
    initializeScreen();
    loadInitialData();
    startAnimations();
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
    updateGreeting();
  }, [i18n.language]);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  const initializeScreen = () => {
    updateGreeting();
    console.log('🏠 SuperDuperHome: Initializing luxury experience with enhanced gallery');
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let greeting = t('time.morning', 'Good Morning');
    if (hour >= 12 && hour < 17) {
      greeting = t('time.afternoon', 'Good Afternoon');
    } else if (hour >= 17 && hour < 21) {
      greeting = t('time.evening', 'Good Evening');
    } else if (hour >= 21 || hour < 6) {
      greeting = t('time.night', 'Good Night');
    }
    setUserName(greeting);
  };
  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading production data from API...');
      
      // Load real cake data from production API
      // ✨ ENHANCED: Categories are now static with production images
      const cakesResponse = await ApiService.getCakes({ limit: 20 });
      
      setCakes(cakesResponse.results || []);
      // Categories are already set with CAKE_CATEGORIES
      
      console.log('✅ Loaded cakes:', cakesResponse.results?.length || 0);
      console.log('✅ Using production categories:', CAKE_CATEGORIES.length);
      
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      // Fallback to mock data for cakes only
      setCakes(ApiService.getMockCakes());
      // Categories remain as CAKE_CATEGORIES
    } finally {
      setIsLoading(false);
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
  // EVENT HANDLERS
  // ============================================================================
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInitialData();
    setIsRefreshing(false);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('🔍 Searching for:', query);
    // TODO: Implement real search functionality
  };
  
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    console.log('🌐 SuperDuperHome: Language changed to:', languageCode);
  };
  
  // ✨ ENHANCED: Category press handler with better feedback
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const categoryName = currentLanguage === 'ar' ? category.nameAr : category.name;
    const categoryDesc = currentLanguage === 'ar' ? category.descriptionAr : category.description;
    
    console.log('🎯 Category pressed:', categoryName);
    
    Alert.alert(
      categoryName,
      `${categoryDesc}\n\n${category.count} ${t('common.cakes', 'cakes available')}`,
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('common.explore', 'Explore'), 
          onPress: () => {
            console.log('🍰 Exploring category:', category.name);
            // TODO: Navigate to category screen
          }
        }
      ]
    );
  };
  
  const handleCakePress = (cake) => {
    Alert.alert(
      cake.name || t('superDuperHome.cakes.defaultName', 'Delicious Cake'),
      `${cake.description || ''}\n\n${cake.price || 'QAR 199'}`,
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { text: t('common.ok', 'View Details'), onPress: () => console.log('🍰 Selected cake:', cake) }
      ]
    );
  };
  
  const handleAIGeneratePress = () => {
    Alert.alert(
      t('superDuperHome.quickActions.aiGenerate', 'AI Generate'),
      t('common.comingSoon', 'Coming soon! AI cake generation feature.'),
      [{ text: t('common.ok', 'OK') }]
    );
  };

  const handleQuickAction = (action) => {
    Alert.alert(
      t(`superDuperHome.quickActions.${action}`, action),
      t('common.comingSoon', 'Feature coming soon!'),
      [{ text: t('common.ok', 'OK') }]
    );
  };

  // ✨ NEW: Enhanced gallery event handler
  const handleGalleryCakePress = (item) => {
    console.log('🎨 Gallery item pressed:', item);
    
    if (item.type === 'gallery') {
      Alert.alert(
        t('superDuperHome.gallery.viewDesign', 'View Design'),
        t('superDuperHome.gallery.designDescription', 'Beautiful cake design for inspiration'),
        [{ text: t('common.ok', 'OK') }]
      );
    } else {
      handleCakePress(item);
    }
  };
  
  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================
  
  const renderHeader = () => (
    <LinearGradient
      colors={[QatarColors.primary, QatarColors.primaryDark, QatarColors.background]}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView>
        <View style={styles.headerContent}>
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>
                {currentLanguage === 'ar' ? 'مرحباً' : userName}
              </Text>
              <Text style={styles.titleText}>
                {t('app.name', 'CakeCrafter.AI')}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => setShowLanguageSwitcher(true)}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>
                  {currentLanguage === 'ar' ? '🇶🇦' : '🇺🇸'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              { transform: [{ scale: searchScale }] }
            ]}
          >
            <BlurView intensity={20} style={styles.searchBlur}>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('superDuperHome.searchPlaceholder', 'Search amazing cakes...')}
                  placeholderTextColor={QatarColors.textMuted}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterIcon}>⚙️</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleAIGeneratePress}
            >
              <LinearGradient
                colors={[QatarColors.secondary, QatarColors.secondaryDark]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🤖</Text>
                <Text style={styles.quickActionText}>
                  {t('superDuperHome.quickActions.aiGenerate', 'AI Generate')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('scanQr')}
            >
              <View style={[styles.quickActionGradient, { backgroundColor: QatarColors.glassEffect }]}>
                <Text style={styles.quickActionIcon}>📱</Text>
                <Text style={styles.quickActionText}>
                  {t('superDuperHome.quickActions.scanQr', 'Scan QR')}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('custom')}
            >
              <View style={[styles.quickActionGradient, { backgroundColor: QatarColors.glassEffect }]}>
                <Text style={styles.quickActionIcon}>🎨</Text>
                <Text style={styles.quickActionText}>
                  {t('superDuperHome.quickActions.custom', 'Custom')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
  
  // ✨ ENHANCED: Categories with production images and improved styling
  const renderCategories = () => (
    <Animated.View 
      style={[
        styles.categoriesSection,
        { transform: [{ scale: categoryScale }] }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            {t('superDuperHome.categories.title', 'Categories')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {currentLanguage === 'ar' ? 'فئات الكيك' : 'Cake Categories'}
          </Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>
            {t('superDuperHome.categories.seeAll', 'All categories')}
          </Text>
          <Text style={styles.seeAllArrow}>→</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.categoryCard, { 
              marginLeft: index === 0 ? Spacing.md : 0 
            }]}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            {/* Enhanced Category Image Container */}
            <View style={[
              styles.categoryImageContainer, 
              { backgroundColor: item.color + '15' }
            ]}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
                resizeMode="cover"
                onError={(error) => {
                  console.warn('❌ Category image failed to load:', item.name, error);
                }}
              />
              
              {/* Enhanced Badge with count */}
              <LinearGradient
                colors={[item.color + 'CC', item.color]}
                style={styles.categoryBadge}
              >
                <Text style={styles.categoryCount}>{item.count}</Text>
              </LinearGradient>
              
              {/* Subtle overlay for better text visibility */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.categoryOverlay}
              />
            </View>
            
            {/* Enhanced Category Info */}
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName} numberOfLines={1}>
                {currentLanguage === 'ar' ? item.nameAr : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        // Enhanced scroll performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={10}
        initialNumToRender={6}
        getItemLayout={(data, index) => ({
          length: CATEGORY_SIZE + Spacing.md,
          offset: (CATEGORY_SIZE + Spacing.md) * index,
          index,
        })}
      />
    </Animated.View>
  );
  
  const renderFeaturedCakes = () => (
    <Animated.View 
      style={[
        styles.featuredSection,
        { transform: [{ scale: featuredScale }] }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('superDuperHome.featured.title', 'Featured Cakes')}
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>
            {t('superDuperHome.featured.seeAll', 'See All')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={cakes.slice(0, 8)}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.featuredList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => handleCakePress(item)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.featuredImage}
              imageStyle={styles.featuredImageStyle}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredOverlay}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {item.rating || '4.8'}</Text>
                  </View>
                  
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredName} numberOfLines={2}>
                      {item.name || t('superDuperHome.cakes.defaultName', 'Delicious Cake')}
                    </Text>
                    <Text style={styles.featuredPrice}>
                      {item.price || 'QAR 199'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </Animated.View>
  );
  
  // ✨ NEW: Enhanced Gallery Component (replaces old static gallery)
  const renderEnhancedGallery = () => (
    <View style={styles.enhancedGallerySection}>
      <EnhancedCakeGallery
        galleryImages={GALLERY_IMAGES}
        cakes={cakes}
        onCakePress={handleGalleryCakePress}
        currentLanguage={currentLanguage}
        style={styles.enhancedGallery}
      />
    </View>
  );
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={QatarColors.primary}
            progressBackgroundColor={QatarColors.surface}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {renderCategories()}
        {renderFeaturedCakes()}
        {renderEnhancedGallery()}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('common.poweredBy', 'Powered by CakeCrafter.AI Qatar')}
          </Text>
        </View>
        
        {/* Spacer for bottom padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAIGeneratePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[QatarColors.secondary, QatarColors.secondaryDark]}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>🤖</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Language Switcher Modal */}
      <LanguageSwitcher
        visible={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={QatarColors.secondary} />
          <Text style={styles.loadingText}>
            {t('superDuperHome.loadingCakes', 'Loading amazing cakes...')}
          </Text>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// LUXURY STYLES (Enhanced with Production Categories Styles)
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QatarColors.background,
  },
  
  // Header Styles
  header: {
    paddingTop: 0,
  },
  
  headerContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  welcomeSection: {
    flex: 1,
  },
  
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.secondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  
  titleText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  profileButton: {
    padding: Spacing.sm,
  },
  
  profileAvatar: {
    width: Layout.avatarSize,
    height: Layout.avatarSize,
    borderRadius: Layout.avatarSize / 2,
    backgroundColor: QatarColors.glassEffect,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: QatarColors.secondary,
  },
  
  profileInitial: {
    fontSize: Typography.fontSize.lg,
  },
  
  // Search Styles
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  
  searchBlur: {
    borderRadius: ComponentStyles.borderRadius.lg,
    overflow: 'hidden',
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: QatarColors.glassEffect,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  
  searchIcon: {
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.sm,
    color: QatarColors.textOnPrimary,
  },
  
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: QatarColors.textOnPrimary,
  },
  
  filterButton: {
    padding: Spacing.sm,
  },
  
  filterIcon: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textOnPrimary,
  },
  
  // Quick Actions Styles
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  quickActionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  
  quickActionGradient: {
    borderRadius: ComponentStyles.borderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
    ...ComponentStyles.shadows.medium,
  },
  
  quickActionIcon: {
    fontSize: Typography.fontSize.lg,
    marginBottom: Spacing.xs,
  },
  
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.textPrimary,
    textAlign: 'center',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  // Section Styles
  categoriesSection: {
    marginTop: Spacing.lg,
  },
  
  featuredSection: {
    marginTop: Spacing.xl,
  },
  
  // ✨ NEW: Enhanced Gallery Styles
  enhancedGallerySection: {
    marginTop: Spacing.xl,
    flex: 1,
  },
  
  enhancedGallery: {
    flex: 1,
    minHeight: 600, // Minimum height for better scrolling experience
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  
  // ✨ ENHANCED: Section Title Container
  sectionTitleContainer: {
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // ✨ ENHANCED: See All Button
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  seeAllArrow: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // ✨ ENHANCED: Categories Styles
  categoriesList: {
    paddingRight: Spacing.md,
  },
  
  categoryCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
    width: CATEGORY_SIZE + 20, // Slightly wider for better touch target
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
  
  // ✨ ENHANCED: Category Overlay
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
  
  // Featured Cakes Styles
  featuredList: {
    paddingLeft: Spacing.md,
  },
  
  featuredCard: {
    width: CARD_WIDTH * 0.75,
    height: Layout.cardHeight,
    marginRight: Spacing.md,
    borderRadius: ComponentStyles.borderRadius.xl,
    overflow: 'hidden',
    ...ComponentStyles.shadows.large,
  },
  
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  
  featuredImageStyle: {
    borderRadius: ComponentStyles.borderRadius.xl,
  },
  
  featuredOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  
  featuredContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  ratingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: QatarColors.overlay,
    borderRadius: ComponentStyles.borderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  
  ratingText: {
    fontSize: Typography.fontSize.xs,
    color: QatarColors.textOnPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  featuredInfo: {
    alignSelf: 'stretch',
  },
  
  featuredName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
    marginBottom: Spacing.xs,
  },
  
  featuredPrice: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: Layout.fabSize,
    height: Layout.fabSize,
    borderRadius: Layout.fabSize / 2,
    ...ComponentStyles.shadows.large,
  },
  
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: Layout.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  fabIcon: {
    fontSize: Typography.fontSize.xl,
  },
  
  // Footer Styles
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
  },
  
  // Loading Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: QatarColors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    fontSize: Typography.fontSize.md,
    color: QatarColors.textOnPrimary,
    marginTop: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
  },
  
  bottomSpacer: {
    height: 100,
  },
});

export default SuperDuperHomeScreen;
