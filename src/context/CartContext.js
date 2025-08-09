// src/context/CartContext.js
// Communication #60.3 - ENTERPRISE-GRADE Shopping Cart State Management
// 🛒 FEATURES: Add/Remove/Update items, AsyncStorage persistence, Qatar branding
// 🎯 INTEGRATION: Designed for EnhancedCakeGallery.js plus button functionality
// ⚡ PERFORMANCE: Optimized state management with useReducer and memoization
// 🌐 i18n: Arabic/English RTL/LTR support
// 💾 PERSISTENCE: AsyncStorage with error handling and recovery
// 🎨 LUXURY: Qatar-branded notifications and styling integration

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid, Platform } from 'react-native';

// ================================
// CART STORAGE & CONFIG - Communication #60.3
// ================================

const CART_STORAGE_KEY = '@CakeCrafter_Cart_v1.0';
const CART_CONFIG = {
  MAX_QUANTITY_PER_ITEM: 99,
  MAX_TOTAL_ITEMS: 500,
  AUTO_SAVE_DEBOUNCE: 1000, // ms
  TOAST_DURATION: 3000, // ms
};

// ================================
// CART ACTION TYPES - Communication #60.3
// ================================

const CART_ACTIONS = {
  // Core cart operations
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  
  // Bulk operations
  ADD_MULTIPLE_ITEMS: 'ADD_MULTIPLE_ITEMS',
  REMOVE_MULTIPLE_ITEMS: 'REMOVE_MULTIPLE_ITEMS',
  
  // State management
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Advanced features
  SAVE_FOR_LATER: 'SAVE_FOR_LATER',
  MOVE_TO_CART: 'MOVE_TO_CART',
  
  // UI state
  SET_CART_VISIBLE: 'SET_CART_VISIBLE',
  SET_LAST_ADDED_ITEM: 'SET_LAST_ADDED_ITEM',
};

// ================================
// INITIAL CART STATE - Communication #60.3
// ================================

const initialCartState = {
  // Cart items data
  items: [], // Array of cart items
  savedForLater: [], // Items saved for later
  
  // Cart calculations
  totalItems: 0,
  totalPrice: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  
  // UI state
  isCartVisible: false,
  lastAddedItem: null,
  
  // Status flags
  isLoading: false,
  error: null,
  isInitialized: false,
  lastSyncTime: null,
};

// ================================
// CART UTILITY FUNCTIONS - Communication #60.3
// ================================

const cartUtils = {
  // Format price with Qatar Riyal
  formatPrice: (price) => {
    if (typeof price === 'string') {
      // Extract numeric value from "QAR 199" format
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return parseFloat(price) || 0;
  },
  
  // Generate unique cart item ID
  generateCartItemId: (item) => {
    return `cart_${item.id || item.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  // Calculate total items count
  calculateTotalItems: (items) => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  },
  
  // Calculate total price
  calculateTotalPrice: (items) => {
    return items.reduce((total, item) => {
      const price = cartUtils.formatPrice(item.price);
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  },
  
  // Create cart item from gallery item
  createCartItem: (galleryItem, quantity = 1) => {
    return {
      // Core identification
      cartItemId: cartUtils.generateCartItemId(galleryItem),
      originalId: galleryItem.id,
      
      // Product information
      name: galleryItem.name,
      nameAr: galleryItem.nameAr || galleryItem.name,
      price: galleryItem.price || 'QAR 199',
      image: galleryItem.image,
      
      // Cart-specific data
      quantity: Math.max(1, Math.min(quantity, CART_CONFIG.MAX_QUANTITY_PER_ITEM)),
      addedAt: new Date().toISOString(),
      
      // Optional product details
      category: galleryItem.category,
      categoryName: galleryItem.categoryName,
      description: galleryItem.description,
      rating: galleryItem.rating,
      isNew: galleryItem.isNew,
      
      // Calculated fields
      itemTotal: cartUtils.formatPrice(galleryItem.price) * quantity,
      
      // Source tracking
      dataSource: galleryItem.dataSource || 'unknown',
    };
  },
  
  // Validate cart item
  validateCartItem: (item) => {
    if (!item.name || !item.price) {
      throw new Error('Cart item must have name and price');
    }
    if (item.quantity < 1 || item.quantity > CART_CONFIG.MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Quantity must be between 1 and ${CART_CONFIG.MAX_QUANTITY_PER_ITEM}`);
    }
    return true;
  },
};

// ================================
// CART REDUCER - Communication #60.3
// ================================

const cartReducer = (state, action) => {
  console.log(`🛒 CartReducer - Communication #60.3: ${action.type}`, action.payload);
  
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { item, quantity = 1, showToast = true } = action.payload;
      
      try {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          cartItem => cartItem.originalId === item.id
        );
        
        let newItems;
        let updatedItem;
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const existingItem = state.items[existingItemIndex];
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            CART_CONFIG.MAX_QUANTITY_PER_ITEM
          );
          
          updatedItem = {
            ...existingItem,
            quantity: newQuantity,
            itemTotal: cartUtils.formatPrice(existingItem.price) * newQuantity,
          };
          
          newItems = [
            ...state.items.slice(0, existingItemIndex),
            updatedItem,
            ...state.items.slice(existingItemIndex + 1),
          ];
        } else {
          // Add new item to cart
          const newCartItem = cartUtils.createCartItem(item, quantity);
          cartUtils.validateCartItem(newCartItem);
          
          newItems = [...state.items, newCartItem];
          updatedItem = newCartItem;
        }
        
        // Check total items limit
        const totalItems = cartUtils.calculateTotalItems(newItems);
        if (totalItems > CART_CONFIG.MAX_TOTAL_ITEMS) {
          throw new Error(`Cannot exceed ${CART_CONFIG.MAX_TOTAL_ITEMS} total items in cart`);
        }
        
        const totalPrice = cartUtils.calculateTotalPrice(newItems);
        
        // Show success toast
        if (showToast) {
          const message = existingItemIndex >= 0 
            ? `Updated ${item.name} quantity to ${updatedItem.quantity}`
            : `Added ${item.name} to cart`;
          
          cartUtils.showToast(message, 'success');
        }
        
        return {
          ...state,
          items: newItems,
          totalItems,
          totalPrice,
          subtotal: totalPrice,
          lastAddedItem: updatedItem,
          error: null,
        };
        
      } catch (error) {
        console.error('❌ Cart Add Item Error:', error);
        cartUtils.showToast(error.message, 'error');
        
        return {
          ...state,
          error: error.message,
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { cartItemId, showToast = true } = action.payload;
      
      const itemToRemove = state.items.find(item => item.cartItemId === cartItemId);
      if (!itemToRemove) {
        return state;
      }
      
      const newItems = state.items.filter(item => item.cartItemId !== cartItemId);
      const totalItems = cartUtils.calculateTotalItems(newItems);
      const totalPrice = cartUtils.calculateTotalPrice(newItems);
      
      if (showToast) {
        cartUtils.showToast(`Removed ${itemToRemove.name} from cart`, 'info');
      }
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
        subtotal: totalPrice,
        error: null,
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartItemId, quantity, showToast = false } = action.payload;
      
      try {
        if (quantity < 1 || quantity > CART_CONFIG.MAX_QUANTITY_PER_ITEM) {
          throw new Error(`Quantity must be between 1 and ${CART_CONFIG.MAX_QUANTITY_PER_ITEM}`);
        }
        
        const itemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
        if (itemIndex === -1) {
          throw new Error('Item not found in cart');
        }
        
        const updatedItem = {
          ...state.items[itemIndex],
          quantity,
          itemTotal: cartUtils.formatPrice(state.items[itemIndex].price) * quantity,
        };
        
        const newItems = [
          ...state.items.slice(0, itemIndex),
          updatedItem,
          ...state.items.slice(itemIndex + 1),
        ];
        
        const totalItems = cartUtils.calculateTotalItems(newItems);
        const totalPrice = cartUtils.calculateTotalPrice(newItems);
        
        if (showToast) {
          cartUtils.showToast(`Updated ${updatedItem.name} quantity to ${quantity}`, 'info');
        }
        
        return {
          ...state,
          items: newItems,
          totalItems,
          totalPrice,
          subtotal: totalPrice,
          error: null,
        };
        
      } catch (error) {
        console.error('❌ Cart Update Quantity Error:', error);
        cartUtils.showToast(error.message, 'error');
        
        return {
          ...state,
          error: error.message,
        };
      }
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      const { showToast = true } = action.payload || {};
      
      if (showToast && state.items.length > 0) {
        cartUtils.showToast(`Cleared ${state.items.length} items from cart`, 'info');
      }
      
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        subtotal: 0,
        lastAddedItem: null,
        error: null,
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      const { cartData } = action.payload;
      
      try {
        if (!cartData || !Array.isArray(cartData.items)) {
          throw new Error('Invalid cart data format');
        }
        
        // Validate all cart items
        cartData.items.forEach(cartUtils.validateCartItem);
        
        const totalItems = cartUtils.calculateTotalItems(cartData.items);
        const totalPrice = cartUtils.calculateTotalPrice(cartData.items);
        
        console.log(`✅ Communication #60.3 - Loaded ${totalItems} items from storage`);
        
        return {
          ...state,
          ...cartData,
          totalItems,
          totalPrice,
          subtotal: totalPrice,
          isInitialized: true,
          lastSyncTime: new Date().toISOString(),
          error: null,
        };
        
      } catch (error) {
        console.error('❌ Cart Load Error:', error);
        
        return {
          ...initialCartState,
          isInitialized: true,
          error: 'Failed to load saved cart',
        };
      }
    }
    
    case CART_ACTIONS.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    
    case CART_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    
    case CART_ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }
    
    case CART_ACTIONS.SET_CART_VISIBLE: {
      return {
        ...state,
        isCartVisible: action.payload,
      };
    }
    
    case CART_ACTIONS.SET_LAST_ADDED_ITEM: {
      return {
        ...state,
        lastAddedItem: action.payload,
      };
    }
    
    case CART_ACTIONS.SAVE_FOR_LATER: {
      const { cartItemId, showToast = true } = action.payload;
      
      const itemToSave = state.items.find(item => item.cartItemId === cartItemId);
      if (!itemToSave) {
        return state;
      }
      
      const newItems = state.items.filter(item => item.cartItemId !== cartItemId);
      const newSavedItems = [...state.savedForLater, { ...itemToSave, savedAt: new Date().toISOString() }];
      
      const totalItems = cartUtils.calculateTotalItems(newItems);
      const totalPrice = cartUtils.calculateTotalPrice(newItems);
      
      if (showToast) {
        cartUtils.showToast(`Saved ${itemToSave.name} for later`, 'info');
      }
      
      return {
        ...state,
        items: newItems,
        savedForLater: newSavedItems,
        totalItems,
        totalPrice,
        subtotal: totalPrice,
      };
    }
    
    case CART_ACTIONS.MOVE_TO_CART: {
      const { savedItemId, showToast = true } = action.payload;
      
      const itemToMove = state.savedForLater.find(item => item.cartItemId === savedItemId);
      if (!itemToMove) {
        return state;
      }
      
      const newSavedItems = state.savedForLater.filter(item => item.cartItemId !== savedItemId);
      const newItems = [...state.items, { ...itemToMove, movedBackAt: new Date().toISOString() }];
      
      const totalItems = cartUtils.calculateTotalItems(newItems);
      const totalPrice = cartUtils.calculateTotalPrice(newItems);
      
      if (showToast) {
        cartUtils.showToast(`Moved ${itemToMove.name} back to cart`, 'success');
      }
      
      return {
        ...state,
        items: newItems,
        savedForLater: newSavedItems,
        totalItems,
        totalPrice,
        subtotal: totalPrice,
      };
    }
    
    default:
      console.warn(`⚠️ Communication #60.3 - Unknown cart action: ${action.type}`);
      return state;
  }
};

// ================================
// TOAST UTILITY - Communication #60.3
// ================================

cartUtils.showToast = (message, type = 'info') => {
  console.log(`🔔 Communication #60.3 - Toast (${type}): ${message}`);
  
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // For iOS, you might want to use a third-party toast library
    Alert.alert('CakeCrafter', message);
  }
};

// ================================
// CART CONTEXT CREATION - Communication #60.3
// ================================

const CartContext = createContext();

// ================================
// CART PROVIDER COMPONENT - Communication #60.3
// ================================

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  
  // ============================================================================
  // ASYNCSTORAGE PERSISTENCE - Communication #60.3
  // ============================================================================
  
  const saveCartToStorage = useCallback(async (cartData) => {
    try {
      const dataToSave = {
        items: cartData.items,
        savedForLater: cartData.savedForLater,
        lastSyncTime: new Date().toISOString(),
        version: '1.0',
      };
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
      console.log(`💾 Communication #60.3 - Cart saved to storage (${cartData.items.length} items)`);
      
    } catch (error) {
      console.error('❌ Communication #60.3 - Failed to save cart:', error);
      cartUtils.showToast('Failed to save cart changes', 'error');
    }
  }, []);
  
  const loadCartFromStorage = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { cartData } });
        console.log(`📱 Communication #60.3 - Cart loaded from storage`);
      } else {
        console.log(`📱 Communication #60.3 - No saved cart found, starting fresh`);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { cartData: initialCartState } });
      }
      
    } catch (error) {
      console.error('❌ Communication #60.3 - Failed to load cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load saved cart' });
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { cartData: initialCartState } });
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  
  // Auto-save cart changes
  useEffect(() => {
    if (cartState.isInitialized && cartState.items.length >= 0) {
      const timeoutId = setTimeout(() => {
        saveCartToStorage(cartState);
      }, CART_CONFIG.AUTO_SAVE_DEBOUNCE);
      
      return () => clearTimeout(timeoutId);
    }
  }, [cartState.items, cartState.savedForLater, cartState.isInitialized, saveCartToStorage]);
  
  // Load cart on app start
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);
  
  // ============================================================================
  // CART ACTION METHODS - Communication #60.3
  // ============================================================================
  
  const addToCart = useCallback((item, quantity = 1, showToast = true) => {
    console.log(`🛒 Communication #60.3 - Adding to cart: ${item.name} (qty: ${quantity})`);
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { item, quantity, showToast }
    });
  }, []);
  
  const removeFromCart = useCallback((cartItemId, showToast = true) => {
    console.log(`🗑️ Communication #60.3 - Removing from cart: ${cartItemId}`);
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { cartItemId, showToast }
    });
  }, []);
  
  const updateQuantity = useCallback((cartItemId, quantity, showToast = false) => {
    console.log(`🔢 Communication #60.3 - Updating quantity: ${cartItemId} -> ${quantity}`);
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { cartItemId, quantity, showToast }
    });
  }, []);
  
  const clearCart = useCallback((showToast = true) => {
    console.log(`🧹 Communication #60.3 - Clearing cart`);
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => dispatch({ 
            type: CART_ACTIONS.CLEAR_CART, 
            payload: { showToast }
          })
        },
      ]
    );
  }, []);
  
  const saveForLater = useCallback((cartItemId, showToast = true) => {
    console.log(`💾 Communication #60.3 - Save for later: ${cartItemId}`);
    dispatch({ 
      type: CART_ACTIONS.SAVE_FOR_LATER, 
      payload: { cartItemId, showToast }
    });
  }, []);
  
  const moveToCart = useCallback((savedItemId, showToast = true) => {
    console.log(`↩️ Communication #60.3 - Move to cart: ${savedItemId}`);
    dispatch({ 
      type: CART_ACTIONS.MOVE_TO_CART, 
      payload: { savedItemId, showToast }
    });
  }, []);
  
  const setCartVisible = useCallback((visible) => {
    dispatch({ type: CART_ACTIONS.SET_CART_VISIBLE, payload: visible });
  }, []);
  
  const clearError = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  }, []);
  
  // ============================================================================
  // CART COMPUTED VALUES - Communication #60.3
  // ============================================================================
  
  const cartComputedValues = useMemo(() => {
    const formattedTotal = cartState.totalPrice.toFixed(2);
    const itemsText = cartState.totalItems === 1 ? 'item' : 'items';
    const isEmpty = cartState.items.length === 0;
    
    return {
      formattedTotal,
      formattedTotalWithCurrency: `QAR ${formattedTotal}`,
      itemsText,
      isEmpty,
      hasItems: !isEmpty,
      averageItemPrice: isEmpty ? 0 : (cartState.totalPrice / cartState.totalItems).toFixed(2),
      uniqueItemsCount: cartState.items.length,
      savedItemsCount: cartState.savedForLater.length,
      lastAddedItemName: cartState.lastAddedItem?.name || null,
    };
  }, [cartState.totalPrice, cartState.totalItems, cartState.items.length, cartState.savedForLater.length, cartState.lastAddedItem]);
  
  // ============================================================================
  // CONTEXT VALUE - Communication #60.3
  // ============================================================================
  
  const contextValue = useMemo(() => ({
    // Cart state
    ...cartState,
    ...cartComputedValues,
    
    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    setCartVisible,
    clearError,
    
    // Utility methods
    formatPrice: cartUtils.formatPrice,
    
    // Storage methods
    saveCartToStorage: () => saveCartToStorage(cartState),
    loadCartFromStorage,
    
    // Constants
    CART_CONFIG,
  }), [
    cartState,
    cartComputedValues,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    setCartVisible,
    clearError,
    saveCartToStorage,
    loadCartFromStorage,
  ]);
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// ================================
// CART HOOK - Communication #60.3
// ================================

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

// ================================
// EXPORT DEFAULT - Communication #60.3
// ================================

export default CartContext;
