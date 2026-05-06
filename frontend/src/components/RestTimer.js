import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const PRESETS = [30, 45, 60, 90];

export default function RestTimer({ color = '#1E90FF' }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(60);
  const intervalRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            pulse();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const start = () => {
    setSeconds(selected);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  const display = seconds > 0 ? seconds : selected;
  const mins = Math.floor(display / 60);
  const secs = display % 60;
  const timeText = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerBox, { borderColor: color, transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.timerLabel, { color }]}>REST TIMER</Text>
        <Text style={[styles.timerText, { color }]}>{timeText}</Text>
      </Animated.View>

      <View style={styles.presetRow}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => { setSelected(p); setRunning(false); setSeconds(0); }}
            style={[
              styles.presetBtn,
              selected === p && { backgroundColor: color, borderColor: color },
            ]}
          >
            <Text style={[styles.presetText, selected === p && styles.presetTextActive]}>{p}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controlRow}>
        {!running ? (
          <TouchableOpacity onPress={start} style={[styles.controlBtn, { backgroundColor: '#32CD32' }]}>
            <Text style={styles.controlText}>START</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pause} style={[styles.controlBtn, { backgroundColor: '#FFD700' }]}>
            <Text style={[styles.controlText, { color: '#000' }]}>PAUSE</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={reset} style={[styles.controlBtn, { backgroundColor: '#E23636' }]}>
          <Text style={styles.controlText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  timerBox: {
    borderWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  presetRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  presetBtn: {
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1A1A1A',
  },
  presetText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  presetTextActive: {
    color: '#000000',
  },
  controlRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  controlBtn: {
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  controlText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
});
