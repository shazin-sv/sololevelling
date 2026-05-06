import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function ExplosionEffect({ active, color = '#FFD700' }) {
  const lines = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      fadeAnim.setValue(1);
      const anims = lines.map((line) =>
        Animated.timing(line, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      );
      Animated.parallel(anims).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      lines.forEach((line) => line.setValue(0));
      fadeAnim.setValue(0);
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {lines.map((line, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const translateX = line.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * 50],
        });
        const translateY = line.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * 50],
        });
        const scale = line.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1.2, 0],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.line,
              {
                backgroundColor: color,
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                  { rotate: `${i * 30}deg` },
                ],
                opacity: fadeAnim,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  line: {
    position: 'absolute',
    width: 6,
    height: 20,
    borderRadius: 2,
  },
});
