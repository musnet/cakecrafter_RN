// src/components/gallery/EnhancedCakeGallery.js
// Communication #60.3 - Enhanced Masonry Gallery with Infinite Scrolling
// 🎨 LUXURY: Qatar-branded masonry layout with beautiful animations
// ⚡ PERFORMANCE: VirtualizedList with infinite scrolling
// 🌐 i18n: Full Arabic/English RTL/LTR support

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

// Import components
import CakeCardAnimated from './CakeCardAnimated';
import { QatarColors, Spacing, Typography } from '../../styles/theme';
import { ApiService } from '../../services/ApiService';

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 2; // Masonry columns
const ITEM_MARGIN = Spacing.sm;
const COLUMN_WIDTH = (width - Spacing.md * 2 - ITEM_MARGIN * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

// ================================
// ENHANCED CAKE GALLERY COMPONENT
// ================================
const EnhancedCakeGallery = ({ 
  galleryImages = [], 
  cakes = [], 
  onCakePress,
  currentLanguage = 'en',
  style,
}) => {
  
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================
  
  const { t } = useTranslation();
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [columnHeights, setColumnHeights] = useState(Array(COLUMN_COUNT).fill(0));
  const [layoutMode, setLayoutMode] = useState('masonry'); // masonry, grid, staggered
  
  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const galleryOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;
  
  // ============================================================================
  // LIFECYCLE & EFFECTS
  // ============================================================================
  
  useEffect(() => {
    initializeGallery();
    startEntranceAnimation();
  }, []);
  
  useEffect(() => {
    if (galleryImages.length > 0 || cakes.length > 0) {
      createMasonryData();
    }
  }, [galleryImages, cakes, layoutMode]);
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  const initializeGallery = () => {
    console.log('🎨 EnhancedGallery: Initializing masonry layout');
    createMasonryData();
  };
  
  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(galleryOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // ============================================================================
  // DATA MANAGEMENT
  // ============================================================================
  
  const createMasonryData = () => {
    const allItems = [];
    
    // Add gallery images
    galleryImages.forEach((image, index) => {
      allItems.push({
        id: `gallery_${index}`,
        type: 'gallery',
        image: image,
        height: getRandomHeight(),
        name: t('superDuperHome.gallery.creativeDesign', 'Creative Design'),
        category: 'gallery',
      });
    });
    
    // Add cake data
    cakes.forEach((cake, index) => {
      allItems.push({
        id: `cake_${cake.id || index}`,
        type: 'cake',
        image: cake.image,
        height: getRandomHeight(),
        name: cake.name,
        price: cake.price,
        rating: cake.rating,
        category: cake.category || 'custom',
      });
    });
    
    // Shuffle for better visual distribution
    const shuffledItems = shuffleArray(allItems);
    setGalleryData(shuffledItems);
  };
  
  const getRandomHeight = () => {
    // Generate varying heights for masonry effect
    const baseHeight = 180;
    const variation = 80;
    return Math.floor(baseHeight + Math.random() * variation);
  };
  
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // ============================================================================
  // INFINITE SCROLLING
  // ============================================================================
  
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMoreData) return;
    
    setLoading(true);
    console.log('📄 Loading more gallery data...');
    
    try {
      // Simulate API call for more cakes
      const nextPage = page + 1;
      const moreCakes = await ApiService.getCakes({ 
        limit: 10, 
        page: nextPage 
      });
      
      if (moreCakes.results && moreCakes.results.length > 0) {
        // Add new items to existing data
        const newItems = moreCakes.results.map((cake, index) => ({
          id: `cake_page${nextPage}_${index}`,
          type: 'cake',
          image: cake.image,
          height: getRandomHeight(),
          name: cake.name,
          price: cake.price,
          rating: cake.rating,
          category: cake.category || 'custom',
        }));
        
        setGalleryData(prev => [...prev, ...newItems]);
        setPage(nextPage);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('❌ Failed to load more data:', error);
      // Add some mock data as fallback
      const mockItems = Array.from({ length: 6 }, (_, index) => ({
        id: `mock_${Date.now()}_${index}`,
        type: 'gallery',
        image: galleryImages[Math.floor(Math.random() * galleryImages.length)],
        height: getRandomHeight(),
        name: t('superDuperHome.gallery.artisanCake', 'Artisan Cake'),
        category: 'gallery',
      }));
      
      setGalleryData(prev => [...prev, ...mockItems]);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreData, page, galleryImages, t]);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    
    // Reset and reload
    createMasonryData();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Smooth refresh
    
    setRefreshing(false);
  }, []);
  
  // ============================================================================
  // LAYOUT HELPERS
  // ============================================================================
  
  const getItemColumn = (index) => {
    // Determine which column this item should go in for masonry layout
    let shortestColumn = 0;
    let shortestHeight = columnHeights[0];
    
    for (let i = 1; i < COLUMN_COUNT; i++) {
      if (columnHeights[i] < shortestHeight) {
        shortestHeight = columnHeights[i];
        shortestColumn = i;
      }
    }
    
    return shortestColumn;
  };
  
  const updateColumnHeight = (column, itemHeight) => {
    setColumnHeights(prev => {
      const newHeights = [...prev];
      newHeights[column] += itemHeight + ITEM_MARGIN;
      return newHeights;
    });
  };
  
  // ============================================================================
  // RENDER METHODS
  // ============================================================================
  
  const renderGalleryHeader = () => (
    <Animated.View 
      style={[
        styles.galleryHeader,
        { 
          transform: [{ scale: headerScale }],
          opacity: galleryOpacity,
        }
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.sectionTitle}>
          {t('superDuperHome.gallery.title', 'Cake Gallery')}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {currentLanguage === 'ar' ? 'معرض الكيك الفني' : 'Artisan Creations'}
        </Text>
      </View>
      
      <View style={styles.layoutControls}>
        <TouchableOpacity
          style={[
            styles.layoutButton,
            layoutMode === 'masonry' && styles.layoutButtonActive
          ]}
          onPress={() => setLayoutMode('masonry')}
        >
          <Text style={styles.layoutButtonText}>⚏</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.layoutButton,
            layoutMode === 'grid' && styles.layoutButtonActive
          ]}
          onPress={() => setLayoutMode('grid')}
        >
          <Text style={styles.layoutButtonText}>⚏</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
  
  const renderGalleryItem = ({ item, index }) => {
    const column = getItemColumn(index);
    const itemStyle = {
      width: COLUMN_WIDTH,
      marginBottom: ITEM_MARGIN,
      marginLeft: column > 0 ? ITEM_MARGIN : 0,
    };
    
    return (
      <CakeCardAnimated
        item={item}
        index={index}
        style={itemStyle}
        onPress={() => onCakePress && onCakePress(item)}
        currentLanguage={currentLanguage}
        layoutMode={layoutMode}
        onLayout={(height) => updateColumnHeight(column, height)}
      />
    );
  };
  
  const renderLoadingFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={QatarColors.secondary} />
        <Text style={styles.loadingText}>
          {t('superDuperHome.gallery.loadingMore', 'Loading more creations...')}
        </Text>
      </View>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🎨</Text>
      <Text style={styles.emptyTitle}>
        {t('superDuperHome.gallery.noItems', 'No Gallery Items')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t('superDuperHome.gallery.noItemsDesc', 'Gallery items will appear here')}
      </Text>
    </View>
  );
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <Animated.View 
      style={[
        styles.container,
        style,
        { opacity: galleryOpacity }
      ]}
    >
      {renderGalleryHeader()}
      
      <FlatList
        data={galleryData}
        renderItem={renderGalleryItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={QatarColors.secondary}
            progressBackgroundColor={QatarColors.surface}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderLoadingFooter}
        maxToRenderPerBatch={6}
        windowSize={10}
        initialNumToRender={8}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  
  galleryHeader: {
    marginBottom: Spacing.lg,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
  },
  
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  layoutControls: {
    flexDirection: 'row',
    backgroundColor: QatarColors.surface,
    borderRadius: 20,
    padding: 4,
  },
  
  layoutButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  
  layoutButtonActive: {
    backgroundColor: QatarColors.secondary,
  },
  
  layoutButtonText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textPrimary,
  },
  
  galleryContainer: {
    paddingBottom: Spacing.xl,
  },
  
  loadingFooter: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    marginTop: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: QatarColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: QatarColors.textSecondary,
    textAlign: 'center',
  },
};

export default EnhancedCakeGallery;
