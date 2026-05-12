// Shadow Leveling System — Design Tokens
// Based on stitch_herofit_rpg_gym_system DESIGN.md

export const COLORS = {
  background: '#131313',
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#20201f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353535',
  surfaceVariant: '#353535',

  onBackground: '#e5e2e1',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#c4c7c7',
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',

  primary: '#c9c6c5',
  onPrimary: '#313030',
  primaryContainer: '#0a0a0a',
  onPrimaryContainer: '#7b7979',
  inversePrimary: '#5f5e5e',
  primaryFixed: '#e5e2e1',
  primaryFixedDim: '#c9c6c5',
  onPrimaryFixed: '#1c1b1b',
  onPrimaryFixedVariant: '#474646',

  secondary: '#bbc3ff',
  onSecondary: '#001d93',
  secondaryContainer: '#0231de',
  onSecondaryContainer: '#b1bbff',
  secondaryFixed: '#dee0ff',
  secondaryFixedDim: '#bbc3ff',
  onSecondaryFixed: '#000f5d',
  onSecondaryFixedVariant: '#002ccd',

  tertiary: '#ffb692',
  onTertiary: '#562000',
  tertiaryContainer: '#180500',
  onTertiaryContainer: '#cb5500',
  tertiaryFixed: '#ffdbcb',
  tertiaryFixedDim: '#ffb692',
  onTertiaryFixed: '#341100',
  onTertiaryFixedVariant: '#7a3000',

  outline: '#8e9192',
  outlineVariant: '#444748',
  surfaceTint: '#c9c6c5',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
};

export const TYPOGRAPHY = {
  headlineXl: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 1.1 * 48,
    letterSpacing: -0.04 * 48,
    fontFamily: undefined, // Anybody — fallback to system bold
  },
  headlineLg: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 1.2 * 32,
    letterSpacing: 0,
    fontFamily: undefined,
  },
  bodyLg: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 1.6 * 18,
    letterSpacing: 0,
    fontFamily: undefined, // Plus Jakarta Sans
  },
  bodyMd: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5 * 16,
    letterSpacing: 0,
    fontFamily: undefined,
  },
  systemData: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 1.2 * 14,
    letterSpacing: 0.05 * 14,
    fontFamily: undefined, // JetBrains Mono
  },
  labelSm: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 1.0 * 12,
    letterSpacing: 0,
    fontFamily: undefined,
  },
};

export const SPACING = {
  unit: 4,
  gutter: 16,
  marginMobile: 20,
  marginDesktop: 40,
  stackTight: 8,
  stackLoose: 32,
};

// Shared effect styles (approximated in RN)
export const SHADOWS = {
  energyGlowBlue: {
    shadowColor: 'rgba(187,195,255,0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  energyGlowOrange: {
    shadowColor: 'rgba(203,85,0,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  bottomNav: {
    shadowColor: 'rgba(203,85,0,0.15)',
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 24,
    elevation: 12,
  },
};
