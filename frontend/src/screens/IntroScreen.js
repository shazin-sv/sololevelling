import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

export default function IntroScreen({ onContinue }) {
  const lines = [
    { text: 'YOU ARE ABOUT TO BECOME', color: '#FFFFFF', size: 18 },
    { text: '50X BETTER', color: '#FFD700', size: 42 },
    { text: 'IMPROVE FOCUS', color: '#60A5FA', size: 24 },
    { text: 'TRAIN HARD', color: '#F87171', size: 24 },
    { text: 'DISCIPLINE IS FREEDOM', color: '#A78BFA', size: 20 },
    { text: 'CONSISTENCY BEATS INTENSITY', color: '#34D399', size: 20 },
    { text: 'YOUR ONLY LIMIT IS YOU', color: '#FBBF24', size: 20 },
    { text: 'LEVEL UP EVERY SINGLE DAY', color: '#22D3EE', size: 20 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SYSTEM INITIALIZED</Text>
        </View>

        {lines.map((line, i) => (
          <Text
            key={i}
            style={[
              styles.line,
              { color: line.color, fontSize: line.size },
              i === 1 && styles.heroLine,
            ]}
          >
            {line.text}
          </Text>
        ))}

        <View style={styles.divider} />

        <Text style={styles.body}>
          The weak fall. The strong endure. You are neither — you are{' '}
          <Text style={styles.highlight}>evolving</Text>.
        </Text>

        <Text style={styles.body}>
          Every rep is a vote for the person you want to become. Every set is a step
          toward the next level. This is not a gym app. This is your{' '}
          <Text style={styles.highlight}>leveling system</Text>.
        </Text>

        <TouchableOpacity onPress={onContinue} style={styles.button}>
          <Text style={styles.buttonText}>CONTINUE →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...Platform.select({ web: { minHeight: '100vh' } }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: 56,
    backgroundColor: COLORS.background,
    ...Platform.select({ web: { minHeight: '100%' } }),
  },
  badge: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  badgeText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.tiny,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  line: {
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  heroLine: {
    textShadowColor: COLORS.onTertiaryContainer,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginVertical: 8,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.secondaryContainer,
    marginVertical: 24,
  },
  body: {
    color: COLORS.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 500,
  },
  highlight: {
    color: COLORS.foreground,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
    alignSelf: 'center',
    ...SHADOWS.large,
  },
  buttonText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
