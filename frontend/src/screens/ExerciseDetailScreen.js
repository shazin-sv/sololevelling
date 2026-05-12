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
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

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
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* TOP NAV */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>EXERCISE_DB</Text>
          </TouchableOpacity>
          <View style={styles.difficulty}>
            <Text style={styles.diffLabel}>Difficulty</Text>
            <View style={styles.starsRow}>
              <Text style={styles.starFilled}>★</Text>
              <Text style={styles.starFilled}>★</Text>
              <Text style={styles.starFilled}>★</Text>
              <Text style={styles.starEmpty}>★</Text>
              <Text style={styles.starEmpty}>★</Text>
            </View>
          </View>
        </View>

        {/* MAIN TITLE */}
        <View style={styles.titleSection}>
          <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>
          <Text style={styles.systemClass}>System.Class: [ COMPOUND_POWER ]</Text>
        </View>

        {/* VIDEO / TUTORIAL */}
        <View style={styles.videoPanel}>
          <View style={styles.videoInner}>
            {Platform.OS === 'web' ? (
              <View style={styles.webFallback}>
                <Text style={styles.webFallbackTitle}>TUTORIAL_V3.2</Text>
                <Text style={styles.webFallbackText}>Web playback opens externally.</Text>
                <TouchableOpacity onPress={() => Linking.openURL(youtubeUrl)} style={styles.playBtn}>
                  <Text style={styles.playBtnText}>▶ OPEN VIDEO</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <WebView originWhitelist={['*']} source={{ uri: youtubeUrl }} style={styles.webview} javaScriptEnabled domStorageEnabled startInLoadingState renderLoading={() => (
                  <View style={styles.loading}><Text style={styles.loadingText}>LOADING...</Text></View>
                )} />
                <TouchableOpacity onPress={() => navigation.navigate('WebView', { uri: youtubeUrl })} style={styles.playOverlay}>
                  <View style={styles.playCircle}><Text style={styles.playIcon}>▶</Text></View>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.videoLabel}><Text style={styles.videoLabelText}>Tutorial_v3.2</Text></View>
        </View>

        {/* SPECS BENTO GRID */}
        <View style={styles.bentoRow}>
          <View style={[styles.bentoCard, styles.bentoWide]}>
            <Text style={styles.bentoLabel}>[ TARGET_MUSCLES ]</Text>
            <View style={styles.tagRow}>
              {exercise.targetMuscles.split(',').map((muscle, i) => (
                <View key={i} style={styles.tag}><Text style={styles.tagText}>{muscle.trim().toUpperCase()}</Text></View>
              ))}
            </View>
          </View>
          <View style={styles.bentoCard}>
            <Text style={styles.bentoLabel}>TECH_SPECS</Text>
            <Text style={styles.bentoValue}>{exercise.sets}</Text>
            <Text style={styles.bentoSublabel}>SETS / REPS</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.descPanel}>
          <Text style={styles.descLabel}>SYSTEM_DESCRIPTION</Text>
          <Text style={styles.descBody}>{exercise.description}</Text>
        </View>

        {/* STEPS */}
        <View style={styles.stepsPanel}>
          <Text style={styles.stepsLabel}>EXECUTION_PROTOCOL</Text>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* REST TIMER */}
        <View style={styles.timerPanel}>
          <Text style={styles.timerLabel}>[ REST TIMER ]</Text>
          <RestTimer color={COLORS.secondary} />
        </View>

        {/* ACTION BUTTON */}
        {isToday && !isRejected && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 20 }}>
            <TouchableOpacity onPress={handleComplete} disabled={completed} style={[styles.actionBtn, { backgroundColor: completed ? COLORS.secondaryContainer : COLORS.onTertiaryContainer }]}>
              <Text style={styles.actionBtnText}>{completed ? 'SESSION CONQUERED ✓' : 'INITIATE SESSION'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isRejected && (
          <View style={[styles.actionBtn, { marginTop: 20, backgroundColor: COLORS.errorContainer }]}>
            <Text style={styles.actionBtnText}>QUEST ABANDONED · -50 XP</Text>
          </View>
        )}

        <ExplosionEffect active={showExplosion} color={COLORS.onTertiaryContainer} />
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderBottomWidth: BORDERS.default,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backIcon: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodyLarge,
    fontWeight: TYPOGRAPHY.weightBlack,
  },
  backText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBold,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  difficulty: {
    alignItems: 'flex-end',
  },
  diffLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  starFilled: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.label,
  },
  starEmpty: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
  },
  titleSection: {
    marginBottom: SPACING.lg,
  },
  exerciseName: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading3,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: -1,
    lineHeight: TYPOGRAPHY.heading3,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  systemClass: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  videoPanel: {
    marginBottom: SPACING.lg,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.large,
  },
  videoInner: {
    height: 200,
    backgroundColor: COLORS.surface,
  },
  webview: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  webFallbackTitle: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
    letterSpacing: 1,
  },
  webFallbackText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBold,
    fontSize: TYPOGRAPHY.small,
    lineHeight: TYPOGRAPHY.small,
    textAlign: 'center',
  },
  playBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  playBtnText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playCircle: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  playIcon: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    marginLeft: SPACING.sm,
  },
  videoLabel: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  videoLabelText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
  },
  loading: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 2,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  bentoWide: {
    flex: 2,
  },
  bentoLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  bentoValue: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.sm,
  },
  bentoSublabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  tagText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descPanel: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  descLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  descBody: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    lineHeight: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  stepsPanel: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  stepsLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  stepNum: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    width: 22,
  },
  stepText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    flex: 1,
    lineHeight: TYPOGRAPHY.bodySmall,
  },
  timerPanel: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  timerLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  actionBtn: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.accent,
    ...SHADOWS.large,
  },
  actionBtnText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.heading5,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
