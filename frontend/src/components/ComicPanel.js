import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function ComicPanel({
  children,
  style,
  color = '#FFFEF0',
  borderColor = '#000000',
  tilt = 0,
  title,
  titleColor = '#000000',
  burst = false,
}) {
  const rotation = tilt;
  return (
    <View style={[styles.outer, { transform: [{ rotate: `${rotation}deg` }] }, style]}>
      <View style={[styles.panel, { backgroundColor: color, borderColor }]}>
        {burst && (
          <View style={styles.burstContainer}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.burstLine,
                  {
                    transform: [{ rotate: `${i * 45}deg` }],
                    backgroundColor: borderColor,
                  },
                ]}
              />
            ))}
          </View>
        )}
        {title && (
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: titleColor }]}>{title}</Text>
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

export function SpeechBubble({ children, style, from = 'left' }) {
  return (
    <View style={[styles.bubbleOuter, style]}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{children}</Text>
      </View>
      <View
        style={[
          styles.bubbleTail,
          from === 'left' ? styles.tailLeft : styles.tailRight,
        ]}
      />
    </View>
  );
}

export function SoundEffect({ text, color = '#E23636', style }) {
  return (
    <View style={[styles.soundOuter, style]}>
      <Text style={[styles.soundText, { color }]}>{text}</Text>
      <View style={[styles.soundOutline, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 8,
  },
  panel: {
    borderWidth: 3,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    elevation: 6,
  },
  burstContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    opacity: 0.15,
  },
  burstLine: {
    position: 'absolute',
    width: 4,
    height: '100%',
  },
  titleContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    margin: -3,
    marginBottom: 8,
    borderBottomRightRadius: 4,
  },
  titleText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  content: {
    padding: 12,
    zIndex: 1,
  },
  bubbleOuter: {
    marginVertical: 8,
    position: 'relative',
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 20,
    padding: 12,
    position: 'relative',
    zIndex: 1,
  },
  bubbleText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -12,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000000',
  },
  tailLeft: {
    left: 20,
  },
  tailRight: {
    right: 20,
  },
  soundOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  soundText: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    letterSpacing: 2,
    zIndex: 1,
  },
  soundOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
    width: '120%',
    height: '120%',
    opacity: 0.3,
  },
});
