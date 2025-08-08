// src/screens/SuperDuperHomeScreen.js - Communication #60.6: Enhanced with Advanced Gallery Scrolling
// 🎨 LUXURY: Premium dark theme with Qatar branding and stunning visuals
// 🌐 i18n: Full Arabic/English support with LanguageSwitcher integration
// 🍰 PRODUCTION: Real cake data from CakeCrafter backend API
// ✨ ENHANCED: Advanced masonry gallery with infinite scrolling and beautiful animations

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
  const [categories, setCategories] = useState([]);
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
      const [cakesResponse, categoriesResponse] = await Promise.all([
        ApiService.getCakes({ limit: 20 }),
        ApiService.getCategories(),
      ]);
      
      setCakes(cakesResponse.results || []);
      setCategories(categoriesResponse || []);
      
      console.log('✅ Loaded cakes:', cakesResponse.results?.length || 0);
      console.log('✅ Loaded categories:', categoriesResponse?.length || 0);
      
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      // Fallback to mock data
      setCakes(ApiService.getMockCakes());
      setCategories(ApiService.getMockCategories());
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
  
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const categoryName = currentLanguage === 'ar' ? category.nameAr : category.name;
    Alert.alert(
      t('superDuperHome.categories.title', 'Categories'),
      `${categoryName} - ${category.count} ${t('common.cakes', 'cakes')}`,
      [{ text: t('common.ok', 'OK') }]
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
  
  const renderCategories = () => (
    <Animated.View 
      style={[
        styles.categoriesSection,
        { transform: [{ scale: categoryScale }] }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('superDuperHome.categories.title', 'Categories')}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {currentLanguage === 'ar' ? 'فئات الكيك' : 'Cake Categories'}
        </Text>
      </View>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryImageContainer, { backgroundColor: item.color + '20' }]}>
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[item.color + '80', item.color]}
                style={styles.categoryBadge}
              >
                <Text style={styles.categoryCount}>{item.count}</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>
                {currentLanguage === 'ar' ? item.nameAr : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
// LUXURY STYLES (Updated with Enhanced Gallery Styles)
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
  
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Categories Styles
  categoriesList: {
    paddingLeft: Spacing.md,
  },
  
  categoryCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  
  categoryImageContainer: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: ComponentStyles.borderRadius.lg,
    padding: Spacing.sm,
    position: 'relative',
    ...ComponentStyles.shadows.medium,
  },
  
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: ComponentStyles.borderRadius.md,
  },
  
  categoryBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 15,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  
  categoryCount: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textOnPrimary,
  },
  
  categoryInfo: {
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  
  categoryName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: QatarColors.textPrimary,
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
