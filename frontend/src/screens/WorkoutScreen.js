import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  PanResponder,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ALTERNATE_EXERCISES, getExerciseVisual } from '../data/workouts';
import ComicPanel, { SoundEffect } from '../components/ComicPanel';
import ExplosionEffect from '../components/ExplosionEffect';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

const SWIPE_THRESHOLD = 110;

function getStatusMeta(status) {
  if (status === 'complete') {
    return { label: '+50 XP', color: '#22C55E', tone: 'CONQUERED' };
  }

  if (status === 'skip') {
    return { label: '-50 XP', color: '#EF4444', tone: 'MISSED' };
  }

  return null;
}

export default function WorkoutScreen({ route, navigation }) {
  const { day } = route.params || {};
  const {
    completed,
    todayKey,
    today,
    decideExercise,
    replaceExercise,
    replacements,
    getExerciseStatus,
    resetDay,
    saveProgress,
    saveStatus,
    WORKOUT_SCHEDULE,
  } = useApp();

  const isToday = day === today;
  const schedule = WORKOUT_SCHEDULE[day] || WORKOUT_SCHEDULE.Monday;
  const isRest = schedule.isRest;

  const exercises = schedule.exercises.map((ex, i) => {
    const key = `${day}_${i}`;
    return replacements[key] || ex;
  });

  const decisionMap = isToday ? completed[todayKey] || {} : {};
  const cards = useMemo(
    () =>
      exercises.map((exercise, index) => ({
        ...exercise,
        index,
        status: getExerciseStatus(decisionMap[exercise.id]),
        image: getExerciseVisual(exercise),
      })),
    [decisionMap, exercises, getExerciseStatus]
  );

  const completedCount = cards.filter((card) => card.status === 'complete').length;
  const skippedCount = cards.filter((card) => card.status === 'skip').length;
  const decisionCount = completedCount + skippedCount;
  const firstPendingIndex = cards.findIndex((card) => !card.status);
  const [browseIndex, setBrowseIndex] = useState(0);
  const currentIndex = isToday ? (firstPendingIndex === -1 ? Math.max(cards.length - 1, 0) : firstPendingIndex) : browseIndex;
  const currentCard = cards[currentIndex];

  const [explodingId, setExplodingId] = useState(null);
  const pan = useRef(new Animated.ValueXY()).current;

  const resetCardPosition = () => {
    pan.setValue({ x: 0, y: 0 });
  };

  const handleDecision = (direction) => {
    if (!isToday || !currentCard || currentCard.status) return;

    const decision = direction === 'right' ? 'complete' : 'skip';
    const exitX = direction === 'right' ? 520 : -520;

    Animated.timing(pan, {
      toValue: { x: exitX, y: direction === 'right' ? -20 : 20 },
      duration: 220,
      useNativeDriver: true,
    }).start(async () => {
      setExplodingId(currentCard.id);
      await decideExercise(currentCard.id, decision);
      resetCardPosition();
      setTimeout(() => setExplodingId(null), 500);
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          isToday && !currentCard?.status && Math.abs(gestureState.dx) > 8,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            handleDecision('right');
            return;
          }

          if (gestureState.dx < -SWIPE_THRESHOLD) {
            handleDecision('left');
            return;
          }

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 6,
          }).start();
        },
      }),
    [currentCard?.id, currentCard?.status, isToday]
  );

  const handleReplace = () => {
    if (!isToday || !currentCard) return;
    const alts = ALTERNATE_EXERCISES[currentCard.name];
    if (!alts || alts.length === 0) return;
    replaceExercise(day, currentCard.index, alts[0]);
  };

  const cardRotate = pan.x.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const yesOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const noOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (isRest) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← BACK</Text>
            </TouchableOpacity>
            <View style={[styles.headerBadge, { backgroundColor: schedule.color || '#555' }]}>
              <Text style={styles.headerBadgeText}>{day.toUpperCase()}</Text>
            </View>
          </View>

          <ComicPanel
            color="#2C2C2C"
            borderColor={schedule.color || '#555'}
            title={schedule.title}
            titleColor={schedule.color || '#FFF'}
          >
            <Text style={styles.subtitle}>{schedule.subtitle}</Text>
            <View style={styles.restContainer}>
              <SoundEffect text="ZZZ..." color="#1E90FF" style={{ marginBottom: 12 }} />
              {schedule.recoveryTips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>★</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </ComicPanel>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <View style={[styles.headerBadge, { backgroundColor: schedule.color || '#555' }]}>
            <Text style={styles.headerBadgeText}>{day.toUpperCase()}</Text>
          </View>
        </View>

        <ComicPanel
          color="#141414"
          borderColor={schedule.color || '#555'}
          title="WORKOUT QUEST"
          titleColor={schedule.color || '#FFF'}
        >
          <Text style={styles.title}>{schedule.title}</Text>
          <Text style={styles.subtitle}>{schedule.subtitle}</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statChip, { borderColor: '#22C55E' }]}>
              <Text style={styles.statLabel}>WINS</Text>
              <Text style={styles.statValue}>{completedCount}</Text>
            </View>
            <View style={[styles.statChip, { borderColor: '#EF4444' }]}>
              <Text style={styles.statLabel}>MISSES</Text>
              <Text style={styles.statValue}>{skippedCount}</Text>
            </View>
            <View style={[styles.statChip, { borderColor: schedule.color || '#555' }]}>
              <Text style={styles.statLabel}>LEFT</Text>
              <Text style={styles.statValue}>{Math.max(cards.length - decisionCount, 0)}</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>{completedCount}/{cards.length} WORKOUTS BANKED</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${cards.length ? (completedCount / cards.length) * 100 : 0}%`,
                    backgroundColor: schedule.color || '#22C55E',
                  },
                ]}
              />
            </View>
          </View>

          {currentCard ? (
            <>
              <View style={styles.deckArea}>
                {cards.slice(currentIndex + 1, currentIndex + 3).reverse().map((card, offset) => (
                  <View
                    key={`${card.id}-stack`}
                    style={[
                      styles.stackCard,
                      {
                        top: 18 + offset * 12,
                        transform: [{ scale: 0.94 - offset * 0.04 }],
                        borderColor: '#252525',
                      },
                    ]}
                  />
                ))}

                <Animated.View
                  style={[
                    styles.cardShell,
                    {
                      transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: cardRotate }],
                    },
                  ]}
                  {...(isToday && !currentCard.status ? panResponder.panHandlers : {})}
                >
                  <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() =>
                      navigation.navigate('ExerciseDetail', {
                        exercise: currentCard,
                        color: schedule.color,
                        isToday,
                        isCompleted: currentCard.status === 'complete',
                        decision: currentCard.status,
                        onComplete: () => decideExercise(currentCard.id, 'complete'),
                      })
                    }
                    style={styles.cardTouchable}
                  >
                    <ImageBackground source={{ uri: currentCard.image }} style={styles.heroImage} imageStyle={styles.heroImageInner}>
                      <View style={styles.heroOverlay} />
                      <Animated.View style={[styles.swipeBadge, styles.swipeLeft, { opacity: noOpacity }]}>
                        <Text style={styles.swipeBadgeText}>-50 XP</Text>
                      </Animated.View>
                      <Animated.View style={[styles.swipeBadge, styles.swipeRight, { opacity: yesOpacity }]}>
                        <Text style={styles.swipeBadgeText}>+50 XP</Text>
                      </Animated.View>

                      <View style={styles.heroTopRow}>
                        <View style={styles.videoPill}>
                          <Text style={styles.videoPillText}>▶ FORM CLIP</Text>
                        </View>
                        <View style={[styles.xpPill, { backgroundColor: currentCard.status === 'skip' ? '#7F1D1D' : '#052E16' }]}>
                          <Text style={styles.xpPillText}>{currentCard.status === 'skip' ? '-50 XP' : '+50 XP'}</Text>
                        </View>
                      </View>

                      <View style={styles.heroBottom}>
                        <Text style={styles.cardIndex}>CARD {currentIndex + 1} / {cards.length}</Text>
                        <Text style={styles.exerciseName}>{currentCard.name}</Text>
                        <Text style={styles.exerciseSets}>{currentCard.sets}</Text>
                      </View>
                    </ImageBackground>

                    <View style={styles.cardBody}>
                      <View style={styles.bodyTopRow}>
                        <View style={styles.metaBadge}>
                          <Text style={styles.metaBadgeText}>{currentCard.targetMuscles}</Text>
                        </View>
                        {currentCard.status && (
                          <View style={[styles.resultBadge, { backgroundColor: getStatusMeta(currentCard.status)?.color }]}>
                            <Text style={styles.resultBadgeText}>{getStatusMeta(currentCard.status)?.tone}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.exerciseDescription}>{currentCard.description}</Text>
                      <Text style={styles.swipeHint}>
                        {isToday && !currentCard.status
                          ? 'Swipe left to miss it. Swipe right to claim it.'
                          : 'Tap the card to open the tutorial and exercise details.'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {isToday && !currentCard.status ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleDecision('left')} style={[styles.actionButton, styles.rejectButton]}>
                    <Text style={styles.actionButtonText}>✕  MISS</Text>
                    <Text style={styles.actionButtonSub}>-50 XP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDecision('right')} style={[styles.actionButton, styles.acceptButton]}>
                    <Text style={styles.actionButtonText}>✓  NEXT</Text>
                    <Text style={styles.actionButtonSub}>+50 XP</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.reviewRow}>
                  {!isToday && (
                    <>
                      <TouchableOpacity
                        onPress={() => setBrowseIndex((value) => Math.max(0, value - 1))}
                        style={[styles.navButton, browseIndex === 0 && styles.navButtonDisabled]}
                        disabled={browseIndex === 0}
                      >
                        <Text style={styles.navButtonText}>PREV</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setBrowseIndex((value) => Math.min(cards.length - 1, value + 1))}
                        style={[styles.navButton, browseIndex === cards.length - 1 && styles.navButtonDisabled]}
                        disabled={browseIndex === cards.length - 1}
                      >
                        <Text style={styles.navButtonText}>NEXT</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}

              <View style={styles.utilityRow}>
                {isToday && ALTERNATE_EXERCISES[currentCard.name] && !currentCard.status ? (
                  <TouchableOpacity onPress={handleReplace} style={styles.utilityButton}>
                    <Text style={styles.utilityButtonText}>↻ SWAP MOVE</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ExerciseDetail', {
                      exercise: currentCard,
                      color: schedule.color,
                      isToday,
                      isCompleted: currentCard.status === 'complete',
                      decision: currentCard.status,
                      onComplete: () => decideExercise(currentCard.id, 'complete'),
                    })
                  }
                  style={styles.utilityButton}
                >
                  <Text style={styles.utilityButtonText}>OPEN DETAILS</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {firstPendingIndex === -1 && isToday ? (
            <View style={styles.completePanel}>
              <Text style={styles.completeTitle}>ALL CARDS RESOLVED ⚔️</Text>
              {cards.map((card) => (
                <View key={card.id} style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>{card.status === 'complete' ? '✅' : '❌'}</Text>
                  <Text style={[styles.summaryText, card.status === 'complete' ? styles.summaryDone : styles.summarySkipped]}>
                    {card.name}
                  </Text>
                  <Text style={styles.summarySets}>{card.sets}</Text>
                </View>
              ))}
              <TouchableOpacity onPress={resetDay} style={[styles.resetBtn, { borderColor: schedule.color || '#555' }]}>
                <Text style={styles.resetBtnText}>RESET DAY</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {isToday && (
            <TouchableOpacity
              onPress={saveProgress}
              disabled={saveStatus === 'saving'}
              style={[
                styles.saveBtn,
                {
                  backgroundColor:
                    saveStatus === 'saved' ? '#15803D' : saveStatus === 'error' ? '#991B1B' : schedule.color || '#1E90FF',
                  opacity: saveStatus === 'saving' ? 0.6 : 1,
                },
              ]}
            >
              <Text style={styles.saveBtnText}>
                {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED ✓' : saveStatus === 'error' ? 'SAVE FAILED ✗' : 'SAVE PROGRESS'}
              </Text>
            </TouchableOpacity>
          )}
        </ComicPanel>

        <ExplosionEffect active={explodingId === currentCard?.id} color={schedule.color || '#FFD700'} />
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
  header: {
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
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  backText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerBadge: {
    backgroundColor: COLORS.accent,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  headerBadgeText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.foreground,
    letterSpacing: 2,
    marginBottom: SPACING.lg,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statChip: {
    flex: 1,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginTop: SPACING.sm,
  },
  progressRow: {
    marginBottom: SPACING.lg,
  },
  progressText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.tiny,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 16,
    backgroundColor: COLORS.background,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  deckArea: {
    minHeight: 520,
    marginTop: SPACING.sm,
    justifyContent: 'center',
  },
  stackCard: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    height: 460,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
  },
  cardShell: {
    zIndex: 5,
  },
  cardTouchable: {
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.large,
  },
  heroImage: {
    height: 280,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  heroImageInner: {
    borderRadius: BORDERS.none,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  swipeBadge: {
    position: 'absolute',
    top: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  swipeLeft: {
    left: SPACING.md,
    backgroundColor: COLORS.error,
  },
  swipeRight: {
    right: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  swipeBadgeText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 1,
    fontSize: TYPOGRAPHY.small,
    textTransform: 'uppercase',
  },
  heroTopRow: {
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  videoPillText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.tiny,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  xpPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.muted,
    ...SHADOWS.small,
  },
  xpPillText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.tiny,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroBottom: {
    zIndex: 2,
  },
  cardIndex: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  exerciseName: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading4,
    fontWeight: TYPOGRAPHY.weightBlack,
    lineHeight: TYPOGRAPHY.heading4,
    marginBottom: SPACING.sm,
  },
  exerciseSets: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  cardBody: {
    padding: SPACING.lg,
  },
  bodyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metaBadge: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  metaBadgeText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  resultBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.muted,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
  },
  resultBadgeText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  exerciseDescription: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    lineHeight: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.sm,
  },
  swipeHint: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  acceptButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  actionButtonSub: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    textAlign: 'center',
    marginTop: SPACING.sm,
    letterSpacing: 1,
  },
  utilityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    flexWrap: 'wrap',
  },
  utilityButton: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.small,
  },
  utilityButtonText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  reviewRow: {
    minHeight: 8,
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  navButton: {
    minWidth: 120,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 1,
    fontSize: TYPOGRAPHY.small,
    textTransform: 'uppercase',
  },
  completePanel: {
    marginTop: SPACING.lg,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  completeTitle: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.heading5,
    marginBottom: SPACING.sm,
    letterSpacing: 0.8,
  },
  completeText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    lineHeight: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  restContainer: {
    paddingVertical: SPACING.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: SPACING.sm,
  },
  tipBullet: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginRight: SPACING.sm,
    fontSize: TYPOGRAPHY.label,
  },
  tipText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    flex: 1,
    lineHeight: TYPOGRAPHY.bodySmall,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: BORDERS.default,
    borderBottomColor: COLORS.border,
  },
  summaryIcon: {
    fontSize: TYPOGRAPHY.label,
    marginRight: SPACING.sm,
  },
  summaryText: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  summaryDone: {
    color: COLORS.secondary,
    textDecorationLine: 'line-through',
  },
  summarySkipped: {
    color: COLORS.error,
    textDecorationLine: 'line-through',
  },
  summarySets: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  resetBtn: {
    marginTop: SPACING.lg,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  resetBtnText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  saveBtn: {
    marginTop: SPACING.lg,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    ...SHADOWS.medium,
  },
  saveBtnText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
