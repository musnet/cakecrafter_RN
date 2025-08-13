// src/screens/AIStudioScreen.js - Communication #63.4.2: Fixed Import and Enhancement UX
// 🔧 FIXED: ApiService import error (generateCake undefined)
// 🎨 FIXED: Enhanced text replaces original in same textbox, no popup
// 🤖 PRESERVED: Complete AI Cake Studio with provider selection and generation
// 🛒 PRESERVED: Full integration with existing cart system
// 🌐 PRESERVED: Complete Arabic/English support with RTL
// ⚡ ENHANCED: Better error handling and UX flow

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Modal,
  FlatList,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

// Import context and services
import { useCart } from '../context/CartContext';
// 🔧 FIXED: Correct import for ApiService class - Communication #63.4.2
import { ApiService } from '../services/ApiService';

// Import theme
import { QatarColors, Spacing, Typography, ComponentStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const PROVIDER_CARD_HEIGHT = 120;
const RESULT_IMAGE_SIZE = width - (Spacing.lg * 2);

// ================================
// AI PROVIDERS CONFIGURATION
// ================================
const AI_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI DALL-E 3',
    nameAr: 'أوبن إيه آي دال-إي 3',
    description: 'Premium AI with highest quality results',
    descriptionAr: 'ذكاء اصطناعي متميز مع أعلى جودة نتائج',
    icon: '🎨',
    gradient: ['#667eea', '#764ba2'],
    estimatedTime: '30-60 seconds',
    estimatedTimeAr: '30-60 ثانية',
    cost: 'Premium',
    costAr: 'متميز',
    features: ['Highest Quality', 'Fast Generation', 'Professional Results'],
    featuresAr: ['أعلى جودة', 'توليد سريع', 'نتائج احترافية'],
    available: true,
  },
  {
    id: 'huggingface_free',
    name: 'Hugging Face (FREE)',
    nameAr: 'هاجنج فيس (مجاني)',
    description: 'Free AI generation with good quality',
    descriptionAr: 'توليد مجاني بالذكاء الاصطناعي مع جودة جيدة',
    icon: '🆓',
    gradient: ['#11998e', '#38ef7d'],
    estimatedTime: '60-120 seconds',
    estimatedTimeAr: '60-120 ثانية',
    cost: 'FREE',
    costAr: 'مجاني',
    features: ['Completely Free', 'Good Quality', 'No Limits'],
    featuresAr: ['مجاني تماماً', 'جودة جيدة', 'بلا حدود'],
    available: true,
  },
  {
    id: 's3_mock_real',
    name: 'S3 Real Cakes (Fallback)',
    nameAr: 'كيكات حقيقية من س3 (احتياطي)',
    description: 'Real cake images from S3 bucket',
    descriptionAr: 'صور كيك حقيقية من مخزن س3',
    icon: '📷',
    gradient: ['#FF6B6B', '#FF8E53'],
    estimatedTime: 'Instant',
    estimatedTimeAr: 'فوري',
    cost: 'FREE',
    costAr: 'مجاني',
    features: ['Real Images', 'Instant', 'Always Available'],
    featuresAr: ['صور حقيقية', 'فوري', 'متاح دائماً'],
    available: true,
  },
];

// ================================
// MAIN AI STUDIO SCREEN COMPONENT
// ================================
const AIStudioScreen = ({ navigation }) => {
  
  // ============================================================================
  // HOOKS & CONTEXT
  // ============================================================================
  
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const isRTL = currentLanguage === 'ar';
  
  const { addToCart } = useCart();
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Provider selection
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableProviders, setAvailableProviders] = useState(AI_PROVIDERS);
  
  // 🔧 FIXED: Enhanced prompt management - Communication #63.4.2
  const [userPrompt, setUserPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPromptEnhanced, setIsPromptEnhanced] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generationId, setGenerationId] = useState(null);
  
  // UI state
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  
  useEffect(() => {
    initializeScreen();
    startAnimations();
  }, []);
  
  useEffect(() => {
    if (generationProgress > 0) {
      Animated.timing(progressAnim, {
        toValue: generationProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [generationProgress]);
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  const initializeScreen = async () => {
    try {
      console.log('🤖 Communication #63.4.2 - Initializing AI Studio Screen');
      
      // Load available providers from API
      await loadProviders();
      
      // Auto-select first available provider
      if (availableProviders.length > 0) {
        setSelectedProvider(availableProviders[0]);
      }
      
    } catch (error) {
      console.error('❌ Communication #63.4.2 - Initialization error:', error);
    }
  };
  
  const loadProviders = async () => {
    try {
      console.log('🔌 Communication #63.4.2 - Loading AI providers from API');
      
      const response = await ApiService.getAIProviders();
      
      if (response.success && response.providers) {
        // Transform API providers to match our UI format
        const transformedProviders = response.providers.map(provider => {
          const defaultProvider = AI_PROVIDERS.find(dp => dp.id === provider.id);
          
          return {
            id: provider.id,
            name: provider.name,
            nameAr: defaultProvider?.nameAr || provider.name,
            description: provider.description,
            descriptionAr: defaultProvider?.descriptionAr || provider.description,
            icon: defaultProvider?.icon || '🤖',
            gradient: defaultProvider?.gradient || ['#667eea', '#764ba2'],
            estimatedTime: provider.estimated_time || 'Unknown',
            estimatedTimeAr: defaultProvider?.estimatedTimeAr || 'غير معروف',
            cost: provider.cost_per_image === '0.000' ? 'FREE' : 'Premium',
            costAr: provider.cost_per_image === '0.000' ? 'مجاني' : 'متميز',
            available: provider.status === 'available',
            features: defaultProvider?.features || ['AI Generation'],
            featuresAr: defaultProvider?.featuresAr || ['توليد بالذكاء الاصطناعي'],
          };
        });
        
        setAvailableProviders(transformedProviders);
        console.log('✅ Communication #63.4.2 - Real providers loaded:', transformedProviders.length);
      } else {
        throw new Error('Invalid providers response');
      }
      
    } catch (error) {
      console.error('❌ Communication #63.4.2 - Error loading real providers:', error);
      // Fallback to static providers
      setAvailableProviders(AI_PROVIDERS);
    }
  };
  
  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // ============================================================================
  // 🔧 FIXED: PROMPT ENHANCEMENT - Communication #63.4.2
  // ============================================================================
  
  const enhancePrompt = async () => {
    if (!userPrompt.trim()) {
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'يرجى إدخال وصف للكيكة أولاً' : 'Please enter a cake description first'
      );
      return;
    }
    
    try {
      setIsEnhancing(true);
      console.log('✨ Communication #63.4.2 - Enhancing prompt via API:', userPrompt);
      
      const response = await ApiService.enhancePrompt(userPrompt, 'elegant', 'celebration');
      
      if (response.success) {
        // 🔧 FIXED: Replace text in same textbox, no popup - Communication #63.4.2
        setUserPrompt(response.enhanced_prompt);
        setIsPromptEnhanced(true);
        console.log('✅ Communication #63.4.2 - Prompt enhancement successful');
      } else {
        throw new Error(response.error || 'Enhancement failed');
      }
      
    } catch (error) {
      console.error('❌ Communication #63.4.2 - Enhancement error:', error);
      
      // 🔧 FIXED: Fallback to local enhancement, no popup - Communication #63.4.2
      const localEnhanced = await enhancePromptLocally(userPrompt);
      setUserPrompt(localEnhanced);
      setIsPromptEnhanced(true);
      
      console.log('🔄 Communication #63.4.2 - Used local prompt enhancement');
      
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const enhancePromptLocally = async (prompt) => {
    // Local enhancement logic for immediate response
    const enhancements = [
      'professional food photography',
      'high-end bakery quality', 
      'beautiful lighting',
      'elegant presentation',
      'detailed texture',
      'clean background',
      'award-winning design',
      'luxury finish'
    ];
    
    // Simple enhancement by adding descriptive terms
    const enhanced = `${prompt}, ${enhancements.slice(0, 4).join(', ')}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return enhanced;
  };
  
  // 🔧 NEW: Reset enhancement state when prompt changes - Communication #63.4.2
  const handlePromptChange = (text) => {
    setUserPrompt(text);
    setIsPromptEnhanced(false); // Reset enhancement state when user edits
  };
  
  // ============================================================================
  // AI GENERATION
  // ============================================================================
  
  const generateCake = async () => {
    if (!selectedProvider) {
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'يرجى اختيار مزود الذكاء الاصطناعي أولاً' : 'Please select an AI provider first'
      );
      return;
    }
    
    if (!userPrompt.trim()) {
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'يرجى إدخال وصف للكيكة أولاً' : 'Please enter a cake description first'
      );
      return;
    }
    
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGeneratedImage(null);
      
      console.log('🎨 Communication #63.4.2 - Starting AI generation');
      console.log(`   Provider: ${selectedProvider.name}, Prompt: ${userPrompt}`);
      
      // Step 1: Initiate generation
      const generation = await ApiService.generateCake(
        userPrompt,
        selectedProvider.id,
        {
          style: 'elegant',
          occasion: 'celebration',
          userId: 1000 // Guest user
        }
      );
      
      if (!generation.success) {
        throw new Error(generation.error || 'Generation failed to start');
      }
      
      console.log('✅ Communication #63.4.2 - Generation initiated:', generation.generation_id);
      setGenerationId(generation.generation_id);
      
      // Step 2: Poll for completion with progress updates
      const finalResult = await ApiService.pollGenerationStatus(
        generation.generation_id,
        (status) => {
          // Progress callback
          const progress = status.progress_percentage || 0;
          setGenerationProgress(progress);
          console.log(`📊 Communication #63.4.2 - Progress: ${progress}%`);
        },
        30 // Max 30 attempts (about 2-3 minutes)
      );
      
      if (finalResult.status === 'completed') {
        // Success! Create result object
        const result = {
          id: `ai_cake_${Date.now()}`,
          image_url: finalResult.image_url,
          prompt: userPrompt,
          provider: selectedProvider.name,
          created_at: new Date().toISOString(),
          generation_time: `${finalResult.generation_time_seconds || 'Unknown'} seconds`,
          cost_qar: finalResult.cost_qar || '0.00',
          generation_id: generation.generation_id,
          s3_url: finalResult.s3_url,
          provider_used: finalResult.provider_used,
        };
        
        setGeneratedImage(result);
        setShowResultModal(true);
        Vibration.vibrate(100);
        
        console.log('🎉 Communication #63.4.2 - AI generation completed successfully!');
        console.log(`   Image URL: ${result.image_url}`);
        
      } else {
        throw new Error(`Generation failed with status: ${finalResult.status}`);
      }
      
    } catch (error) {
      console.error('❌ Communication #63.4.2 - AI generation error:', error);
      
      Alert.alert(
        isRTL ? 'خطأ في التوليد' : 'Generation Error',
        isRTL 
          ? `فشل في توليد الكيكة: ${error.message}`
          : `Failed to generate cake: ${error.message}`,
        [
          { text: isRTL ? 'موافق' : 'OK' },
          {
            text: isRTL ? 'إعادة المحاولة' : 'Retry',
            onPress: () => generateCake()
          }
        ]
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };
  
  // ============================================================================
  // CART INTEGRATION
  // ============================================================================
  
  const addGeneratedCakeToCart = () => {
    if (!generatedImage) return;
    
    try {
      // Use actual cost from API if available, otherwise random price
      const actualCost = generatedImage.cost_qar && parseFloat(generatedImage.cost_qar) > 0 
        ? Math.ceil(parseFloat(generatedImage.cost_qar) * 100) // Convert to QAR (assuming cost is in dollars)
        : Math.floor(Math.random() * (600 - 300 + 1)) + 300;
      
      const cakeItem = {
        id: generatedImage.id,
        name: `AI Generated Cake`,
        nameAr: `كيكة مولدة بالذكاء الاصطناعي`,
        image: generatedImage.image_url,
        price: actualCost,
        currency: 'QAR',
        description: generatedImage.prompt,
        descriptionAr: `كيكة مولدة بالذكاء الاصطناعي: ${generatedImage.prompt}`,
        category: 'ai_generated',
        provider: generatedImage.provider,
        isAIGenerated: true,
        generatedAt: generatedImage.created_at,
        generationId: generatedImage.generation_id,
        actualCost: generatedImage.cost_qar,
        s3Url: generatedImage.s3_url,
        quantity: 1,
      };
      
      addToCart(cakeItem, 1, true);
      
      console.log(`🛒 Communication #63.4.2 - Added AI cake to cart: QAR ${actualCost}`);
      
      // Close result modal after adding to cart
      setShowResultModal(false);
      
      // Show success message
      Alert.alert(
        isRTL ? 'تمت الإضافة!' : 'Added Successfully!',
        isRTL 
          ? `تمت إضافة الكيكة المولدة بالذكاء الاصطناعي للسلة بسعر ${actualCost} ريال قطري`
          : `AI generated cake added to cart for QAR ${actualCost}`,
        [
          { text: isRTL ? 'متابعة' : 'Continue' },
          { 
            text: isRTL ? 'عرض السلة' : 'View Cart',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Communication #63.4.2 - Cart error:', error);
      Alert.alert(
        isRTL ? 'خطأ' : 'Error',
        isRTL ? 'فشل في إضافة الكيكة للسلة' : 'Failed to add cake to cart'
      );
    }
  };
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowProviderModal(false);
    console.log('🔌 Communication #63.4.2 - Provider selected:', provider.name);
  };
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // ============================================================================
  // RENDER METHODS
  // ============================================================================
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <Text style={styles.backButtonText}>
          {isRTL ? '◀' : '◀'} {isRTL ? 'رجوع' : 'Back'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>
          {isRTL ? 'استوديو الكيك بالذكاء الاصطناعي' : 'AI Cake Studio'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isRTL ? 'صمم كيكتك المثالية' : 'Design Your Perfect Cake'}
        </Text>
      </View>
    </View>
  );
  
  const renderProviderSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {isRTL ? 'اختر مزود الذكاء الاصطناعي' : 'Choose AI Provider'}
      </Text>
      
      <TouchableOpacity
        style={styles.providerSelector}
        onPress={() => setShowProviderModal(true)}
      >
        {selectedProvider ? (
          <LinearGradient
            colors={selectedProvider.gradient}
            style={styles.selectedProviderCard}
          >
            <View style={styles.providerCardContent}>
              <Text style={styles.providerIcon}>{selectedProvider.icon}</Text>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>
                  {isRTL ? selectedProvider.nameAr : selectedProvider.name}
                </Text>
                <Text style={styles.providerCost}>
                  {isRTL ? selectedProvider.costAr : selectedProvider.cost}
                </Text>
              </View>
              <Text style={styles.providerArrow}>
                {isRTL ? '◀' : '▶'}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.placeholderProvider}>
            <Text style={styles.placeholderText}>
              {isRTL ? 'اضغط لاختيار المزود' : 'Tap to Select Provider'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
  
  // 🔧 FIXED: Enhanced prompt input section - Communication #63.4.2
  const renderPromptInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {isRTL ? 'صف الكيكة التي تريدها' : 'Describe Your Dream Cake'}
      </Text>
      
      <View style={styles.promptInputContainer}>
        <TextInput
          style={[
            styles.promptInput, 
            isRTL && styles.promptInputRTL,
            isPromptEnhanced && styles.promptInputEnhanced
          ]}
          placeholder={isRTL 
            ? 'مثال: كيكة شوكولاتة بالفراولة مع ورود وردية...'
            : 'e.g., Chocolate cake with strawberries and pink roses...'
          }
          placeholderTextColor={QatarColors.textSecondary}
          value={userPrompt}
          onChangeText={handlePromptChange}
          multiline={true}
          numberOfLines={3}
          textAlign={isRTL ? 'right' : 'left'}
        />
        
        <TouchableOpacity
          style={[
            styles.enhanceButton, 
            isEnhancing && styles.enhanceButtonLoading,
            isPromptEnhanced && styles.enhanceButtonEnhanced
          ]}
          onPress={enhancePrompt}
          disabled={isEnhancing || !userPrompt.trim()}
        >
          {isEnhancing ? (
            <ActivityIndicator size="small" color={QatarColors.textOnPrimary} />
          ) : (
            <Text style={styles.enhanceButtonText}>
              {isPromptEnhanced ? '✅' : '✨'} {isRTL ? 'تحسين' : 'Enhance'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      
      {isPromptEnhanced && (
        <View style={styles.enhancedIndicator}>
          <Text style={styles.enhancedIndicatorText}>
            ✨ {isRTL ? 'تم تحسين الوصف' : 'Prompt Enhanced'}
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderGenerationSection = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={[
          styles.generateButton,
          (!selectedProvider || !userPrompt.trim()) && styles.generateButtonDisabled,
          isGenerating && styles.generateButtonGenerating
        ]}
        onPress={generateCake}
        disabled={!selectedProvider || !userPrompt.trim() || isGenerating}
      >
        <LinearGradient
          colors={
            isGenerating 
              ? ['#FF6B6B', '#FF8E53']
              : (!selectedProvider || !userPrompt.trim())
                ? ['#95A5A6', '#7F8C8D']
                : ['#8B1538', '#B91C47']
          }
          style={styles.generateButtonGradient}
        >
          {isGenerating ? (
            <View style={styles.generatingContent}>
              <ActivityIndicator size="small" color={QatarColors.textOnPrimary} />
              <Text style={styles.generateButtonText}>
                {isRTL ? 'جاري التوليد...' : 'Generating...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.generateButtonText}>
              🎨 {isRTL ? 'توليد الكيكة' : 'Generate Cake'}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      {isGenerating && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(generationProgress)}% {isRTL ? 'مكتمل' : 'Complete'}
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderProviderModal = () => (
    <Modal
      visible={showProviderModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProviderModal(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={50} style={styles.modalBlur}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isRTL ? 'اختر مزود الذكاء الاصطناعي' : 'Select AI Provider'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowProviderModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableProviders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.providerModalCard}
                  onPress={() => handleProviderSelect(item)}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={styles.providerModalGradient}
                  >
                    <View style={styles.providerModalContent}>
                      <Text style={styles.providerModalIcon}>{item.icon}</Text>
                      <View style={styles.providerModalInfo}>
                        <Text style={styles.providerModalName}>
                          {isRTL ? item.nameAr : item.name}
                        </Text>
                        <Text style={styles.providerModalDescription}>
                          {isRTL ? item.descriptionAr : item.description}
                        </Text>
                        <Text style={styles.providerModalTime}>
                          ⏱️ {isRTL ? item.estimatedTimeAr : item.estimatedTime}
                        </Text>
                      </View>
                      <View style={styles.providerModalBadge}>
                        <Text style={styles.providerModalCost}>
                          {isRTL ? item.costAr : item.cost}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        </BlurView>
      </View>
    </Modal>
  );
  
  const renderResultModal = () => (
    <Modal
      visible={showResultModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowResultModal(false)}
    >
      <View style={styles.resultModalOverlay}>
        <BlurView intensity={30} style={styles.resultModalBlur}>
          <View style={styles.resultModalContainer}>
            <View style={styles.resultModalHeader}>
              <Text style={styles.resultModalTitle}>
                {isRTL ? '🎉 تم التوليد بنجاح!' : '🎉 Generation Complete!'}
              </Text>
              <TouchableOpacity
                style={styles.resultModalCloseButton}
                onPress={() => setShowResultModal(false)}
              >
                <Text style={styles.resultModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {generatedImage && (
              <View style={styles.resultContent}>
                <Image
                  source={{ uri: generatedImage.image_url }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPrompt}>
                    {generatedImage.prompt}
                  </Text>
                  <Text style={styles.resultProvider}>
                    {isRTL ? 'المزود: ' : 'Provider: '}{generatedImage.provider_used || generatedImage.provider}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={addGeneratedCakeToCart}
                >
                  <LinearGradient
                    colors={['#8B1538', '#B91C47']}
                    style={styles.addToCartGradient}
                  >
                    <Text style={styles.addToCartText}>
                      🛒 {isRTL ? 'إضافة للسلة' : 'Add to Cart'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://cakecrafterapi.ebita.ai/media/generated_images/background_luxury.jpg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[QatarColors.background || '#0F0F23', 'rgba(15, 15, 35, 0.95)']}
          style={styles.overlay}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {renderHeader()}
            
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderProviderSelection()}
              {renderPromptInput()}
              {renderGenerationSection()}
            </ScrollView>
          </Animated.View>
          
          {renderProviderModal()}
          {renderResultModal()}
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES - Communication #63.4.2 - Enhanced for UX improvements
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QatarColors.background || '#0F0F23',
  },
  
  backgroundImage: {
    flex: 1,
  },
  
  overlay: {
    flex: 1,
  },
  
  content: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg || 24,
    paddingVertical: Spacing.md || 16,
    paddingTop: Spacing.xl || 32,
  },
  
  backButton: {
    paddingHorizontal: Spacing.md || 16,
    paddingVertical: Spacing.sm || 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  backButtonText: {
    color: QatarColors.textPrimary || '#FFFFFF',
    fontSize: Typography.fontSize?.md || 16,
    fontWeight: Typography.fontWeight?.medium || '500',
  },
  
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.md || 16,
  },
  
  headerTitle: {
    fontSize: Typography.fontSize?.xl || 24,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: QatarColors.textPrimary || '#FFFFFF',
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: Typography.fontSize?.md || 16,
    color: QatarColors.textSecondary || '#CCCCCC',
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: Spacing.lg || 24,
    paddingBottom: Spacing.xxl || 48,
  },
  
  // Section Styles
  section: {
    marginBottom: Spacing.xl || 32,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: QatarColors.textPrimary || '#FFFFFF',
    marginBottom: Spacing.md || 16,
  },
  
  // Provider Selection Styles
  providerSelector: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  selectedProviderCard: {
    padding: Spacing.lg || 24,
  },
  
  providerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  providerIcon: {
    fontSize: 32,
    marginRight: Spacing.md || 16,
  },
  
  providerInfo: {
    flex: 1,
  },
  
  providerName: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  
  providerCost: {
    fontSize: Typography.fontSize?.md || 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  providerArrow: {
    fontSize: Typography.fontSize?.lg || 20,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight?.bold || 'bold',
  },
  
  placeholderProvider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.lg || 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  
  placeholderText: {
    color: QatarColors.textSecondary || '#CCCCCC',
    fontSize: Typography.fontSize?.md || 16,
  },
  
  // 🔧 ENHANCED: Prompt Input Styles - Communication #63.4.2
  promptInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: Spacing.md || 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  promptInput: {
    fontSize: Typography.fontSize?.md || 16,
    color: QatarColors.textPrimary || '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.md || 16,
  },
  
  promptInputRTL: {
    textAlign: 'right',
  },
  
  // 🔧 NEW: Enhanced prompt input styling - Communication #63.4.2
  promptInputEnhanced: {
    borderColor: QatarColors.secondary || '#B91C47',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.sm || 8,
    backgroundColor: 'rgba(139, 21, 56, 0.05)',
  },
  
  enhanceButton: {
    backgroundColor: QatarColors.secondary || '#B91C47',
    paddingHorizontal: Spacing.lg || 24,
    paddingVertical: Spacing.sm || 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  enhanceButtonLoading: {
    backgroundColor: QatarColors.textSecondary || '#CCCCCC',
  },
  
  // 🔧 NEW: Enhanced button styling - Communication #63.4.2
  enhanceButtonEnhanced: {
    backgroundColor: '#22C55E', // Green for success
  },
  
  enhanceButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize?.md || 16,
    fontWeight: Typography.fontWeight?.bold || 'bold',
  },
  
  // 🔧 NEW: Enhanced indicator - Communication #63.4.2
  enhancedIndicator: {
    marginTop: Spacing.sm || 8,
    paddingHorizontal: Spacing.md || 16,
    paddingVertical: Spacing.xs || 4,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    alignItems: 'center',
  },
  
  enhancedIndicatorText: {
    fontSize: Typography.fontSize?.sm || 14,
    color: '#22C55E',
    fontWeight: Typography.fontWeight?.medium || '500',
  },
  
  // Generation Styles
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  generateButtonDisabled: {
    opacity: 0.5,
  },
  
  generateButtonGenerating: {
    // Animation styles can be added here
  },
  
  generateButtonGradient: {
    paddingVertical: Spacing.lg || 24,
    paddingHorizontal: Spacing.xl || 32,
    alignItems: 'center',
  },
  
  generateButtonText: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: '#FFFFFF',
  },
  
  generatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  progressContainer: {
    marginTop: Spacing.lg || 24,
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm || 8,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: QatarColors.secondary || '#B91C47',
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: Typography.fontSize?.sm || 14,
    color: QatarColors.textSecondary || '#CCCCCC',
    fontWeight: Typography.fontWeight?.medium || '500',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: QatarColors.surface || '#1A1A2E',
    borderRadius: 24,
    padding: Spacing.lg || 24,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg || 24,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize?.xl || 24,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: QatarColors.textPrimary || '#FFFFFF',
  },
  
  modalCloseButton: {
    padding: Spacing.sm || 8,
  },
  
  modalCloseText: {
    fontSize: Typography.fontSize?.lg || 20,
    color: QatarColors.textSecondary || '#CCCCCC',
  },
  
  // Provider Modal Card Styles
  providerModalCard: {
    marginBottom: Spacing.md || 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  providerModalGradient: {
    padding: Spacing.lg || 24,
  },
  
  providerModalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  providerModalIcon: {
    fontSize: 40,
    marginRight: Spacing.md || 16,
  },
  
  providerModalInfo: {
    flex: 1,
  },
  
  providerModalName: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  
  providerModalDescription: {
    fontSize: Typography.fontSize?.sm || 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  
  providerModalTime: {
    fontSize: Typography.fontSize?.xs || 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  providerModalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md || 16,
    paddingVertical: Spacing.xs || 4,
    borderRadius: 12,
  },
  
  providerModalCost: {
    fontSize: Typography.fontSize?.sm || 14,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: '#FFFFFF',
  },
  
  // Result Modal Styles
  resultModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  resultModalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  
  resultModalContainer: {
    width: width * 0.95,
    maxHeight: height * 0.85,
    backgroundColor: QatarColors.surface || '#1A1A2E',
    borderRadius: 24,
    overflow: 'hidden',
  },
  
  resultModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg || 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  resultModalTitle: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: QatarColors.textPrimary || '#FFFFFF',
  },
  
  resultModalCloseButton: {
    padding: Spacing.sm || 8,
  },
  
  resultModalCloseText: {
    fontSize: Typography.fontSize?.lg || 20,
    color: QatarColors.textSecondary || '#CCCCCC',
  },
  
  resultContent: {
    padding: Spacing.lg || 24,
  },
  
  resultImage: {
    width: RESULT_IMAGE_SIZE,
    height: RESULT_IMAGE_SIZE,
    borderRadius: 16,
    marginBottom: Spacing.lg || 24,
  },
  
  resultInfo: {
    marginBottom: Spacing.lg || 24,
  },
  
  resultPrompt: {
    fontSize: Typography.fontSize?.md || 16,
    color: QatarColors.textPrimary || '#FFFFFF',
    lineHeight: (Typography.fontSize?.md || 16) * 1.4,
    marginBottom: Spacing.sm || 8,
  },
  
  resultProvider: {
    fontSize: Typography.fontSize?.sm || 14,
    color: QatarColors.textSecondary || '#CCCCCC',
    fontStyle: 'italic',
  },
  
  addToCartButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  addToCartGradient: {
    paddingVertical: Spacing.lg || 24,
    alignItems: 'center',
  },
  
  addToCartText: {
    fontSize: Typography.fontSize?.lg || 20,
    fontWeight: Typography.fontWeight?.bold || 'bold',
    color: '#FFFFFF',
  },
});

export default AIStudioScreen;