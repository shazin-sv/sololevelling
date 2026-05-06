import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import ComicPanel, { SoundEffect } from '../components/ComicPanel';
import RestTimer from '../components/RestTimer';
import ExplosionEffect from '../components/ExplosionEffect';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise, color, isToday, isCompleted, decision, onComplete } = route.params || {};
  const [completed, setCompleted] = useState(isCompleted || decision === 'complete');
  const isRejected = decision === 'skip';
  const [showExplosion, setShowExplosion] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    exercise.youtubeQuery || exercise.name
  )}`;

  useEffect(() => {
    if (showExplosion) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [showExplosion, scaleAnim]);

  const handleComplete = () => {
    if (completed || !isToday) return;
    setCompleted(true);
    setShowExplosion(true);
    if (onComplete) onComplete();
    setTimeout(() => setShowExplosion(false), 800);
  };

  const steps = [
    'Set up the equipment correctly and select appropriate weight.',
    'Brace your core and maintain proper posture throughout.',
    'Execute the movement with controlled tempo — 2 seconds down, 1 second up.',
    'Focus on squeezing the target muscle at peak contraction.',
    'Breathe out on exertion and in during the eccentric phase.',
    'Perform all sets with good form. Stop if form breaks down.',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <SoundEffect text="POW!" color={color || '#E23636'} />
        </View>

        {/* TITLE */}
        <ComicPanel
          color="#2C2C2C"
          borderColor={color || '#E23636'}
          title="EXERCISE"
          titleColor={color || '#E23636'}
        >
          <Text style={[styles.exerciseName, { color: color || '#FFFFFF' }]}>
            {exercise.name.toUpperCase()}
          </Text>
          <Text style={styles.exerciseSets}>{exercise.sets}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </ComicPanel>

        {/* YOUTUBE VIDEO */}
        <ComicPanel
          color="#000000"
          borderColor={color || '#E23636'}
          title="TUTORIAL"
          titleColor={color || '#E23636'}
          style={{ marginTop: 12 }}
        >
          <View style={styles.videoContainer}>
            {Platform.OS === 'web' ? (
              <View style={styles.webFallback}>
                <Text style={styles.webFallbackTitle}>VIDEO OPENS IN A NEW TAB ON WEB</Text>
                <Text style={styles.webFallbackText}>
                  Expo WebView support on web is flaky here, so we avoid the broken embed and open the
                  YouTube tutorial directly instead.
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(youtubeUrl)}
                  style={styles.webOpenBtn}
                >
                  <Text style={styles.webOpenBtnText}>OPEN YOUTUBE SEARCH</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WebView
                originWhitelist={['*']}
                source={{ uri: youtubeUrl }}
                style={styles.webview}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View style={styles.loading}>
                    <Text style={styles.loadingText}>LOADING...</Text>
                  </View>
                )}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'web') {
                Linking.openURL(youtubeUrl);
                return;
              }
              navigation.navigate('WebView', { uri: youtubeUrl });
            }}
            style={styles.openExternalBtn}
          >
            <Text style={styles.openExternalText}>OPEN IN BROWSER →</Text>
          </TouchableOpacity>
        </ComicPanel>

        {/* TARGET MUSCLES */}
        <ComicPanel
          color="#2C2C2C"
          borderColor="#FFD700"
          title="TARGET MUSCLES"
          titleColor="#FFD700"
          style={{ marginTop: 12 }}
        >
          <Text style={styles.muscleText}>{exercise.targetMuscles}</Text>
        </ComicPanel>

        {/* STEPS */}
        <ComicPanel
          color="#FFFEF0"
          borderColor="#000000"
          title="HOW TO PERFORM"
          titleColor="#000000"
          style={{ marginTop: 12 }}
        >
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </ComicPanel>

        {/* REST TIMER */}
        <ComicPanel
          color="#2C2C2C"
          borderColor="#1E90FF"
          title="REST TIMER"
          titleColor="#1E90FF"
          style={{ marginTop: 12 }}
        >
          <RestTimer color="#1E90FF" />
        </ComicPanel>

        {/* COMPLETE BUTTON */}
        {isToday && !isRejected && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 16 }}>
            <TouchableOpacity
              onPress={handleComplete}
              disabled={completed}
              style={[
                styles.completeBtn,
                { backgroundColor: completed ? '#32CD32' : color || '#E23636' },
              ]}
            >
              <Text style={styles.completeBtnText}>
                {completed ? 'COMPLETED! +50 XP' : 'MARK AS COMPLETED'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isRejected && (
          <View style={[styles.completeBtn, { marginTop: 16, backgroundColor: '#991B1B' }]}>
            <Text style={styles.completeBtnText}>SKIPPED ON CARD DECK · -50 XP</Text>
          </View>
        )}

        <ExplosionEffect active={showExplosion} color={color || '#FFD700'} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  exerciseSets: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    fontWeight: '700',
    lineHeight: 20,
  },
  videoContainer: {
    height: 220,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 10,
  },
  webFallbackTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
  },
  webFallbackText: {
    color: '#CCCCCC',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  webOpenBtn: {
    marginTop: 6,
    borderWidth: 2,
    borderColor: '#1E90FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  webOpenBtnText: {
    color: '#1E90FF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 2,
  },
  openExternalBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  openExternalText: {
    color: '#1E90FF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  muscleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 12,
  },
  stepText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  completeBtn: {
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
