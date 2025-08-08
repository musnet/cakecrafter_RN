// src/styles/theme.js - Communication #61.3: Qatar Luxury Theme for Expo
export const QatarColors = {
  // Qatar National Colors
  primary: '#8B1538',           // Qatar Maroon
  primaryDark: '#5D1A1A',       // Darker Maroon
  secondary: '#FFD700',         // Qatar Gold  
  secondaryDark: '#E6C200',     // Darker Gold
  
  // Background Colors
  background: '#0F0F23',        // Deep dark navy
  surface: '#1E1E3F',          // Card backgrounds
  surfaceLight: '#2A2A4A',     // Lighter surface
  
  // Text Colors
  textPrimary: '#FFFFFF',      // White text
  textSecondary: '#B0B0B0',    // Light gray
  textMuted: '#808080',        // Muted gray
  textOnPrimary: '#FFFFFF',    // Text on primary color
  
  // Interactive Colors
  glassEffect: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  error: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const ComponentStyles = {
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const Layout = {
  headerHeight: 120,
  avatarSize: 40,
  categorySize: 80,
  cardHeight: 200,
  fabSize: 56,
};
