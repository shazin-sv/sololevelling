import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function StreakFlame({ streak, size = 'large' }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <View style={[styles.flameOuter, isLarge && styles.flameLarge]}>
          <Text style={[styles.flameIcon, isLarge && styles.flameIconLarge]}>🔥</Text>
        </View>
      </Animated.View>
      <View style={styles.badge}>
        <Text style={[styles.badgeText, isLarge && styles.badgeTextLarge]}>
          {streak} DAY{streak !== 1 ? 'S' : ''}
        </Text>
      </View>
      {streak >= 7 && (
        <View style={styles.bonusBadge}>
          <Text style={styles.bonusText}>STREAK!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  flameOuter: {
    backgroundColor: '#E23636',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  flameLarge: {
    width: 72,
    height: 72,
  },
  flameIcon: {
    fontSize: 28,
  },
  flameIconLarge: {
    fontSize: 36,
  },
  badge: {
    marginTop: -8,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  badgeTextLarge: {
    fontSize: 12,
  },
  bonusBadge: {
    marginTop: 4,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: '-5deg' }],
  },
  bonusText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1,
  },
});
