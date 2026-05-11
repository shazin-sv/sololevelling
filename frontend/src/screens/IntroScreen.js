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
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll}>
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
    backgroundColor: '#050816',
    ...Platform.select({ web: { minHeight: '100vh' } }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#050816',
  },
  scroll: {
    flexGrow: 1,
    padding: 28,
    paddingBottom: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { minHeight: '100%' } }),
  },
  badge: {
    borderWidth: 2,
    borderColor: '#1D4ED8',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 28,
  },
  badgeText: {
    color: '#60A5FA',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 2,
  },
  line: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  heroLine: {
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginVertical: 8,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#1D4ED8',
    borderRadius: 2,
    marginVertical: 24,
  },
  body: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 500,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: '900',
  },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
