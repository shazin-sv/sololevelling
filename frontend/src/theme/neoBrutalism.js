// Neo-brutalism Design System Tokens
// Light mode, high-contrast, hard-edged, maximalist aesthetic

export const COLORS = {
  // Backgrounds
  background: '#FFFDF5', // Cream/Off-White canvas
  surface: '#FFFFFF', // White for cards/panels
  surfaceLow: '#FFFDF5', // Same as background
  
  // Foreground (Ink)
  foreground: '#000000', // Pure black for all text, borders, shadows
  onBackground: '#000000',
  onSurface: '#000000',
  
  // Accent Colors
  accent: '#FF6B6B', // Hot Red - primary action
  secondary: '#FFD93D', // Vivid Yellow - secondary highlight
  muted: '#C4B5FD', // Soft Violet - tertiary depth
  
  // Semantic Colors
  success: '#32CD32', // Green
  error: '#FF6B6B', // Red (same as accent)
  warning: '#FFD93D', // Yellow (same as secondary)
  info: '#C4B5FD', // Violet (same as muted)
  
  // Border Colors
  border: '#000000', // Always pure black
  borderThin: '#000000',
  borderThick: '#000000',
};

export const TYPOGRAPHY = {
  // Font Family
  fontFamily: 'SpaceGrotesk_700Bold',
  fontFamilyBlack: 'SpaceGrotesk_900Black',
  fontFamilyMedium: 'SpaceGrotesk_500Medium',
  fontFamilyRegular: 'SpaceGrotesk_400Regular',
  
  // Font Weights
  weightBlack: '900',
  weightBold: '700',
  weightMedium: '500',
  weightRegular: '400',
  
  // Font Sizes
  display: 96, // text-9xl
  heading1: 72, // text-8xl
  heading2: 60, // text-7xl
  heading3: 48, // text-6xl
  heading4: 36, // text-5xl
  heading5: 30, // text-4xl
  bodyLarge: 24, // text-3xl
  body: 20, // text-2xl
  bodySmall: 18, // text-xl
  label: 16, // text-base
  small: 14, // text-sm
  tiny: 12, // text-xs
};

export const SPACING = {
  // Base 8px grid
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Section padding
  sectionPadding: 64, // py-16
  sectionPaddingLarge: 128, // py-32
};

export const BORDERS = {
  // Border widths
  none: 0,
  thin: 2, // border-2
  default: 4, // border-4 (signature thickness)
  thick: 8, // border-8
  massive: 12, // border-12
  
  // Border radius
  none: 0, // Sharp corners (default)
  pill: 9999, // rounded-full
};

export const SHADOWS = {
  // Hard offset shadows (zero blur, zero spread)
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  massive: {
    shadowColor: '#000000',
    shadowOffset: { width: 16, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 16,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

export const TRANSFORMS = {
  // Rotations for sticker effect
  rotate1: '1deg',
  rotate2: '2deg',
  rotate3: '3deg',
  rotateNeg1: '-1deg',
  rotateNeg2: '-2deg',
  rotateNeg3: '-3deg',
};

export const ANIMATION = {
  // Fast, snappy transitions
  duration: {
    fast: 100,
    normal: 200,
    slow: 300,
  },
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDERS,
  SHADOWS,
  TRANSFORMS,
  ANIMATION,
};
