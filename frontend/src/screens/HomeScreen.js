import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { logout } from '../utils/auth';
import { clearAllData } from '../utils/storage';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';
import { getExerciseVisual } from '../data/workouts';

export default function HomeScreen({ navigation }) {
  const {
    today,
    todayWorkout,
    todayCompletedCount,
    todayTotal,
    level,
    nextLevel,
    xpProgress,
    xp,
    streak,
    todayExercises,
    completed,
    todayKey,
    WORKOUT_SCHEDULE,
    user,
    setSession,
    refreshFromServer,
    totalCompleted,
    saveProgress,
    saveStatus,
  } = useApp();

  const isRest = todayWorkout.isRest;
  const [showWeekly, setShowWeekly] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    await clearAllData();
    setSession?.(null);
  };

  const dayColor = todayWorkout.accent || COLORS.onTertiaryContainer;
  const activeQuests = todayTotal - todayCompletedCount;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* TOP APP BAR */}
        <View style={styles.topBar}>
          <View style={styles.topBarInner}>
            <View style={styles.logoRow}>
              <Text style={styles.logoIcon}>⚡</Text>
              <Text style={styles.logoTitle}>HERO_SYSTEM_V1.0</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.pingDot} />
                <Text style={styles.onlineText}>System: Online</Text>
              </View>
            </View>
            <View style={styles.levelBox}>
              <Text style={styles.levelLabel}>Power Level</Text>
              <Text style={styles.levelValue}>LVL <Text style={{ color: COLORS.onTertiaryContainer }}>{level.rank}</Text></Text>
            </View>
          </View>
        </View>

        {/* MENU */}
        {menuVisible && (
          <View style={styles.menuPanel}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); navigation.navigate('Badges'); }} style={styles.menuItem}>
              <Text style={styles.menuItemText}>🏅 BADGES</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); refreshFromServer(); }} style={styles.menuItem}>
              <Text style={styles.menuItemText}>↻ SYNC</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); handleLogout(); }} style={styles.menuItem}>
              <Text style={styles.menuItemText}>🚪 LOG OUT</Text>
            </TouchableOpacity>
            <View style={styles.menuLevelBadge}>
              <Text style={styles.menuLevelText}>{level.name}</Text>
            </View>
          </View>
        )}

        {/* DAILY QUEST HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Quest</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>STREAK: {streak} DAYS</Text>
          </View>
        </View>

        {/* SYSTEM NOTIFICATION */}
        <View style={styles.systemBanner}>
          <Text style={styles.systemLabel}>[ SYSTEM NOTIFICATION ]</Text>
          <Text style={styles.systemMessage}>You are going to make it.</Text>
        </View>

        {/* PROGRESS HUD */}
        <View style={styles.hudRow}>
          <View style={[styles.xpCard, SHADOWS.energyGlowBlue]}>
            <Text style={styles.hudLabel}>Experience Points</Text>
            <Text style={styles.xpPercent}>{Math.round((xpProgress || 0) * 100)}<Text style={{ fontSize: 20, opacity: 0.5 }}>%</Text></Text>
            <Text style={styles.xpNext}>NEXT LVL: {nextLevel ? nextLevel.xpRequired : 'MAX'} XP</Text>
            <View style={styles.xpBarTrack}>
              <View style={[styles.xpBarFill, { width: `${Math.max(0, Math.min(1, xpProgress || 0)) * 100}%` }]} />
            </View>
          </View>
          <View style={styles.questCountCard}>
            <Text style={styles.hudLabel}>Active Quests</Text>
            <Text style={styles.questBig}>{String(activeQuests).padStart(2, '0')}</Text>
            <Text style={styles.questStatus}>TO-DO STATUS: OPTIMAL</Text>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={saveProgress}
          disabled={saveStatus === 'saving'}
          style={[
            styles.saveBtn,
            {
              backgroundColor: saveStatus === 'saved' ? COLORS.secondaryContainer : saveStatus === 'error' ? COLORS.errorContainer : COLORS.surfaceContainerHigh,
              borderColor: saveStatus === 'saved' ? COLORS.secondary : saveStatus === 'error' ? COLORS.error : COLORS.outlineVariant,
            },
          ]}
        >
          <Text style={styles.saveBtnText}>
            {saveStatus === 'saving' ? 'SYNCING...' : saveStatus === 'saved' ? 'SAVED ✓' : saveStatus === 'error' ? 'FAIL ✗' : '💾 SAVE PROGRESS'}
          </Text>
        </TouchableOpacity>

        {/* QUEST CARDS — BENTO GRID */}
        {!isRest && todayExercises.map((ex, i) => {
          const status = completed[todayKey]?.[ex.id];
          const isDone = status === 'complete';
          const isSkipped = status === 'skip';
          return (
            <TouchableOpacity
              key={ex.id}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: ex, color: dayColor, isToday: true, isCompleted: isDone, decision: status, onComplete: () => {} })}
              style={styles.questCard}
            >
              <View style={styles.questImageWrap}>
                <Image source={{ uri: getExerciseVisual(ex) }} style={styles.questImage} resizeMode="cover" />
                <View style={styles.questImageOverlay} />
              </View>
              <View style={styles.questContent}>
                <View style={styles.questTag}>
                  <Text style={styles.questTagText}>{todayWorkout.title}</Text>
                </View>
                <Text style={styles.questName}>{ex.name.toUpperCase()}</Text>
                <Text style={styles.questSets}>{ex.sets}</Text>
                <View style={styles.questStatusRow}>
                  <Text style={[styles.questStatusText, isDone && { color: COLORS.secondary }, isSkipped && { color: COLORS.error }]}>
                    {isDone ? '✓ CONQUERED' : isSkipped ? '✗ MISSED' : '⏳ PENDING'}
                  </Text>
                  <View style={styles.enterBtn}>
                    <Text style={styles.enterBtnText}>ENTER →</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {isRest && (
          <View style={styles.restCard}>
            <Text style={styles.restIcon}>💤</Text>
            <Text style={styles.restTitle}>RECOVER LIKE A HERO</Text>
            <Text style={styles.restBody}>Sleep well. Eat protein. Stretch. Tomorrow you hunt again.</Text>
          </View>
        )}

        {/* TOTAL STATS */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: COLORS.secondary }]}>
            <Text style={styles.statValue}>{totalCompleted}</Text>
            <Text style={styles.statLabel}>WORKOUTS DONE</Text>
          </View>
          <View style={[styles.statBox, { borderColor: COLORS.onTertiaryContainer }]}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>
        </View>

        {/* WEEKLY SCHEDULE */}
        <TouchableOpacity onPress={() => setShowWeekly(v => !v)} style={styles.weeklyToggle}>
          <Text style={styles.weeklyToggleText}>{showWeekly ? 'HIDE' : 'SHOW'} WEEKLY SCHEDULE</Text>
        </TouchableOpacity>

        {showWeekly && (
          <View style={styles.weeklyGrid}>
            {Object.entries(WORKOUT_SCHEDULE).map(([dayName, schedule]) => {
              const isToday = dayName === today;
              return (
                <TouchableOpacity
                  key={dayName}
                  onPress={() => navigation.navigate('Workout', { day: dayName })}
                  style={[styles.dayCard, { borderColor: schedule.accent || COLORS.outline, opacity: isToday ? 1 : 0.7 }]}
                >
                  <Text style={[styles.dayName, { color: schedule.accent || COLORS.onSurface }]}>
                    {dayName.slice(0, 3).toUpperCase()}
                  </Text>
                  {isToday && todayTotal > 0 && (
                    <View style={[styles.dayPill, { backgroundColor: todayCompletedCount === todayTotal ? COLORS.secondaryContainer : schedule.accent || COLORS.outline }]}>
                      <Text style={styles.dayPillText}>{todayCompletedCount}/{todayTotal}</Text>
                    </View>
                  )}
                  <Text style={styles.dayTitle} numberOfLines={1}>{schedule.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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

  // Top App Bar
  topBar: {
    backgroundColor: COLORS.background,
    borderBottomWidth: BORDERS.default,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginHorizontal: -SPACING.lg,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.lg,
  },
  topBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIcon: {
    fontSize: TYPOGRAPHY.bodyLarge,
    fontWeight: TYPOGRAPHY.weightBlack,
  },
  logoTitle: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.secondary,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  pingDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.foreground,
  },
  onlineText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  levelBox: {
    backgroundColor: COLORS.accent,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  levelLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  levelValue: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: BORDERS.default,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading4,
    fontWeight: TYPOGRAPHY.weightBlack,
    textTransform: 'uppercase',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  streakIcon: {
    fontSize: TYPOGRAPHY.label,
  },
  streakText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
  },

  // System banner
  systemBanner: {
    backgroundColor: COLORS.secondary,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  systemLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  systemMessage: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
  },

  // HUD
  hudRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  xpCard: {
    flex: 2,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  hudLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  xpPercent: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading1,
    fontWeight: TYPOGRAPHY.weightBlack,
    lineHeight: TYPOGRAPHY.heading1,
  },
  xpNext: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginTop: SPACING.sm,
  },
  xpBarTrack: {
    height: 16,
    backgroundColor: COLORS.background,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  questCountCard: {
    flex: 1,
    backgroundColor: COLORS.muted,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  questBig: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading1,
    fontWeight: TYPOGRAPHY.weightBlack,
    lineHeight: TYPOGRAPHY.heading1,
  },
  questStatus: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    marginTop: SPACING.sm,
  },

  // Save button
  saveBtn: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.secondary,
    ...SHADOWS.medium,
  },
  saveBtnText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Quest cards
  questCard: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.large,
  },
  questImageWrap: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  questImage: {
    width: '100%',
    height: '100%',
  },
  questImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  questContent: {
    padding: SPACING.lg,
  },
  questTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
  },
  questTagText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
  },
  questName: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading4,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.sm,
  },
  questSets: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
    marginBottom: SPACING.md,
  },
  questStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questStatusText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.foreground,
  },
  enterBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  enterBtnText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    textTransform: 'uppercase',
  },

  // Rest card
  restCard: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.large,
  },
  restIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  restTitle: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.sm,
  },
  restBody: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.weightBold,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  statValue: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading3,
    fontWeight: TYPOGRAPHY.weightBlack,
  },
  statLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: SPACING.sm,
  },

  // Weekly schedule
  weeklyToggle: {
    alignSelf: 'center',
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  weeklyToggleText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBlack,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weeklyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  dayCard: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  dayName: {
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
    marginBottom: SPACING.sm,
    color: COLORS.foreground,
  },
  dayTitle: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    textAlign: 'center',
  },
  dayPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.accent,
    borderWidth: BORDERS.thin,
    borderColor: COLORS.border,
  },
  dayPillText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBlack,
  },

  // Menu
  menuPanel: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...SHADOWS.medium,
  },
  menuItem: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    ...SHADOWS.small,
  },
  menuItemText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBlack,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuLevelBadge: {
    backgroundColor: COLORS.muted,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  menuLevelText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
  },
});
