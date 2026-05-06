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
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ALTERNATE_EXERCISES, WORKOUT_SCHEDULE, getExerciseVisual } from '../data/workouts';
import ComicPanel, { SoundEffect } from '../components/ComicPanel';
import ExplosionEffect from '../components/ExplosionEffect';

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
        <View style={styles.scroll}>
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
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.scroll}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
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
  headerBadge: {
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    transform: [{ rotate: '2deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#AAAAAA',
    letterSpacing: 2,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statChip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: '#0E0E0E',
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E8E8E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  progressRow: {
    marginBottom: 14,
  },
  progressText: {
    color: '#E5E5E5',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#000000',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#282828',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  deckArea: {
    minHeight: 540,
    marginTop: 8,
    justifyContent: 'center',
  },
  stackCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 480,
    borderRadius: 28,
    backgroundColor: '#121212',
    borderWidth: 1,
  },
  cardShell: {
    zIndex: 5,
  },
  cardTouchable: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111111',
    borderWidth: 1.5,
    borderColor: '#2A2A2A',
  },
  heroImage: {
    height: 320,
    justifyContent: 'space-between',
    padding: 18,
  },
  heroImageInner: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  swipeBadge: {
    position: 'absolute',
    top: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.78)',
  },
  swipeLeft: {
    left: 18,
    borderColor: '#EF4444',
  },
  swipeRight: {
    right: 18,
    borderColor: '#22C55E',
  },
  swipeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTopRow: {
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoPill: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  videoPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  xpPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  xpPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  heroBottom: {
    zIndex: 2,
  },
  cardIndex: {
    color: '#D4D4D4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 31,
    marginBottom: 8,
  },
  exerciseSets: {
    color: '#E5E5E5',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardBody: {
    padding: 18,
  },
  bodyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  metaBadge: {
    flex: 1,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaBadgeText: {
    color: '#E5E5E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  exerciseDescription: {
    color: '#CACACA',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 10,
  },
  swipeHint: {
    color: '#7D7D7D',
    fontSize: 12,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#000000',
  },
  rejectButton: {
    backgroundColor: '#991B1B',
  },
  acceptButton: {
    backgroundColor: '#15803D',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  actionButtonSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 1,
  },
  utilityRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  utilityButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#303030',
    backgroundColor: '#101010',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  utilityButtonText: {
    color: '#E5E5E5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  reviewRow: {
    minHeight: 8,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  navButton: {
    minWidth: 120,
    borderRadius: 14,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#2B2B2B',
    paddingVertical: 12,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },
  completePanel: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    backgroundColor: '#101010',
    padding: 16,
  },
  completeTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  completeText: {
    color: '#B5B5B5',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  restContainer: {
    paddingVertical: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  tipBullet: {
    color: '#FFD700',
    fontWeight: '900',
    marginRight: 8,
    fontSize: 14,
  },
  tipText: {
    color: '#DDDDDD',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  summaryIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  summaryText: {
    flex: 1,
    color: '#DDDDDD',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryDone: {
    color: '#22C55E',
    textDecorationLine: 'line-through',
  },
  summarySkipped: {
    color: '#EF4444',
    textDecorationLine: 'line-through',
  },
  summarySets: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '800',
  },
  resetBtn: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#555555',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#111111',
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  saveBtn: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
