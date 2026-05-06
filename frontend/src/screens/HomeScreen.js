import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import ComicPanel, { SpeechBubble } from '../components/ComicPanel';
import ProgressRing from '../components/ProgressRing';
import StreakFlame from '../components/StreakFlame';
import { logout } from '../utils/auth';
import { clearAllData } from '../utils/storage';

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
    getMotivationalMessage,
    todayExercises,
    completed,
    todayKey,
    WORKOUT_SCHEDULE,
    user,
    setSession,
  } = useApp();

  const dayColor = todayWorkout.color || '#1E90FF';
  const message = getMotivationalMessage();
  const isRest = todayWorkout.isRest;

  const weeklyProgress = Object.keys(todayWorkout.exercises || []).map((_, idx) => {
    const key = `${today}_${idx}`;
    return !!(completed[todayKey] || {})[key] || false;
  });

  const [showWeekly, setShowWeekly] = useState(false);

  const handleLogout = async () => {
    await logout();
    await clearAllData();
    setSession?.(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <View style={[styles.titleBadge, { backgroundColor: dayColor }]}>
              <Text style={styles.titleBadgeText}>HEROFIT</Text>
            </View>
            {user?.username ? <Text style={styles.userLabel}>@{user.username}</Text> : null}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')} style={styles.badgeBtn}>
              <Text style={styles.badgeBtnText}>🏅 BADGES</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>LOG OUT</Text>
            </TouchableOpacity>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level.name}</Text>
            </View>
          </View>
        </View>

        {/* MOTIVATIONAL SPEECH BUBBLE */}
        <SpeechBubble style={styles.speechBubble}>{message}</SpeechBubble>

        {/* TODAY'S WORKOUT CARD */}
        <ComicPanel
          color="#2C2C2C"
          borderColor={dayColor}
          title={isRest ? 'REST DAY' : 'TODAY\'S WORKOUT'}
          titleColor={dayColor}
        >
          <Text style={[styles.workoutTitle, { color: dayColor }]}>
            {todayWorkout.title}
          </Text>
          <Text style={styles.workoutSubtitle}>{todayWorkout.subtitle}</Text>

          {!isRest && (
            <>
              <View style={styles.progressRow}>
                <ProgressRing
                  progress={todayCompletedCount}
                  total={todayTotal}
                  size={110}
                  strokeWidth={10}
                  color={dayColor}
                />
                <View style={styles.statsColumn}>
                  <StreakFlame streak={streak} size="small" />
                  <View style={styles.xpBox}>
                    <Text style={styles.xpLabel}>XP</Text>
                    <Text style={styles.xpValue}>{xp}</Text>
                  </View>
                </View>
              </View>

              {nextLevel && (
                <View style={styles.xpBarContainer}>
                  <View style={[styles.xpBarFill, { width: `${Math.max(0, Math.min(1, xpProgress)) * 100}%`, backgroundColor: dayColor }]} />
                  <Text style={styles.xpBarText}>
                    {xp} / {nextLevel.xpRequired} XP → {nextLevel.name}
                  </Text>
                </View>
              )}
            </>
          )}

          {isRest && (
            <View style={styles.restBox}>
              <Text style={styles.restIcon}>💤</Text>
              <Text style={styles.restText}>RECOVER. GROW. DOMINATE.</Text>
            </View>
          )}
        </ComicPanel>

        {/* ACTION BUTTONS */}
        {!isRest && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Workout', { day: today })}
            style={[styles.actionBtn, { backgroundColor: dayColor }]}
          >
            <Text style={styles.actionBtnText}>
              {todayCompletedCount === todayTotal ? 'VIEW WORKOUT' : 'START WORKOUT'}
            </Text>
          </TouchableOpacity>
        )}

        {isRest && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Workout', { day: today })}
            style={[styles.actionBtn, { backgroundColor: '#1E90FF' }]}
          >
            <Text style={styles.actionBtnText}>VIEW RECOVERY TIPS</Text>
          </TouchableOpacity>
        )}

        {/* WEEKLY SCHEDULE PREVIEW */}
        <TouchableOpacity onPress={() => setShowWeekly(!showWeekly)} style={styles.toggleWeekly}>
          <Text style={styles.toggleWeeklyText}>
            {showWeekly ? 'HIDE' : 'SHOW'} WEEKLY SCHEDULE
          </Text>
        </TouchableOpacity>

        {showWeekly && (
          <View style={styles.weeklyGrid}>
            {Object.entries(WORKOUT_SCHEDULE).map(([dayName, schedule]) => {
              const isToday = dayName === today;
              return (
                <TouchableOpacity
                  key={dayName}
                  onPress={() => navigation.navigate('Workout', { day: dayName })}
                  style={[
                    styles.dayCard,
                    { borderColor: schedule.color || '#555', opacity: isToday ? 1 : 0.7 },
                  ]}
                >
                  <Text style={[styles.dayName, { color: schedule.color || '#FFF' }]}>
                    {dayName.slice(0, 3).toUpperCase()}
                  </Text>
                  <Text style={styles.dayTitle} numberOfLines={1}>
                    {schedule.title}
                  </Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  badgeBtn: {
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  badgeBtnText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  titleBadge: {
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    transform: [{ rotate: '-2deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  titleBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  userLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
    marginLeft: 4,
    letterSpacing: 1,
  },
  logoutBtn: {
    borderWidth: 2,
    borderColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#020617',
  },
  logoutBtnText: {
    color: '#CBD5E1',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  levelBadge: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '2deg' }],
  },
  levelText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  speechBubble: {
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  workoutSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CCCCCC',
    letterSpacing: 2,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statsColumn: {
    alignItems: 'center',
  },
  xpBox: {
    marginTop: 8,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  xpLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  xpValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  xpBarContainer: {
    height: 24,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
    justifyContent: 'center',
  },
  xpBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  xpBarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    zIndex: 1,
  },
  restBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  restIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  restText: {
    color: '#1E90FF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  actionBtn: {
    marginTop: 16,
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  toggleWeekly: {
    marginTop: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleWeeklyText: {
    color: '#AAAAAA',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  weeklyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
    justifyContent: 'space-between',
  },
  dayCard: {
    width: '31%',
    backgroundColor: '#2C2C2C',
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  dayName: {
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 4,
  },
  dayTitle: {
    color: '#AAAAAA',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
});
