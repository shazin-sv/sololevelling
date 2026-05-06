import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveRemoteProgress } from './auth';

const KEYS = {
  COMPLETED: 'herofit_completed',
  STREAK: 'herofit_streak',
  LAST_WORKOUT_DATE: 'herofit_last_date',
  XP: 'herofit_xp',
  TOTAL_COMPLETED: 'herofit_total',
  WEEKS_COMPLETED: 'herofit_weeks',
  LEG_DAYS: 'herofit_leg_days',
  BADGES_EARNED: 'herofit_badges',
  REPLACEMENTS: 'herofit_replacements',
  NOTIFICATIONS_ENABLED: 'herofit_notifications',
};

function defaultProgress() {
  return {
    completed: {},
    streak: 0,
    lastWorkoutDate: null,
    xp: 0,
    totalCompleted: 0,
    weeksCompleted: 0,
    legDaysCompleted: 0,
    badgesEarned: [],
    replacements: {},
    notificationsEnabled: false,
  };
}

async function syncRemote() {
  try {
    const progress = await exportProgress();
    await saveRemoteProgress(progress);
  } catch {
    // stay usable offline / if backend is unavailable
  }
}

export async function hydrateProgress(progress = {}) {
  const merged = {
    ...defaultProgress(),
    ...(progress || {}),
  };

  try {
    await AsyncStorage.multiSet([
      [KEYS.COMPLETED, JSON.stringify(merged.completed || {})],
      [KEYS.STREAK, String(merged.streak || 0)],
      [KEYS.LAST_WORKOUT_DATE, merged.lastWorkoutDate || ''],
      [KEYS.XP, String(merged.xp || 0)],
      [KEYS.TOTAL_COMPLETED, String(merged.totalCompleted || 0)],
      [KEYS.WEEKS_COMPLETED, String(merged.weeksCompleted || 0)],
      [KEYS.LEG_DAYS, String(merged.legDaysCompleted || 0)],
      [KEYS.BADGES_EARNED, JSON.stringify(merged.badgesEarned || [])],
      [KEYS.REPLACEMENTS, JSON.stringify(merged.replacements || {})],
      [KEYS.NOTIFICATIONS_ENABLED, String(!!merged.notificationsEnabled)],
    ]);
  } catch {
    // silently fail
  }
}

export async function exportProgress() {
  const [
    completed,
    streak,
    lastWorkoutDate,
    xp,
    totalCompleted,
    weeksCompleted,
    legDaysCompleted,
    badgesEarned,
    replacements,
    notificationsEnabled,
  ] = await Promise.all([
    getCompletedExercises(),
    getStreak(),
    getLastWorkoutDate(),
    getXP(),
    getTotalCompleted(),
    getWeeksCompleted(),
    getLegDaysCompleted(),
    getBadgesEarned(),
    getReplacements(),
    getNotificationsEnabled(),
  ]);

  return {
    completed,
    streak,
    lastWorkoutDate,
    xp,
    totalCompleted,
    weeksCompleted,
    legDaysCompleted,
    badgesEarned,
    replacements,
    notificationsEnabled,
  };
}

export async function getCompletedExercises() {
  try {
    const data = await AsyncStorage.getItem(KEYS.COMPLETED);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export async function saveCompletedExercises(completed) {
  try {
    await AsyncStorage.setItem(KEYS.COMPLETED, JSON.stringify(completed));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getStreak() {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveStreak(streak) {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, String(streak));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getLastWorkoutDate() {
  try {
    const value = await AsyncStorage.getItem(KEYS.LAST_WORKOUT_DATE);
    return value || null;
  } catch {
    return null;
  }
}

export async function saveLastWorkoutDate(date) {
  try {
    await AsyncStorage.setItem(KEYS.LAST_WORKOUT_DATE, date || '');
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getXP() {
  try {
    const data = await AsyncStorage.getItem(KEYS.XP);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveXP(xp) {
  try {
    await AsyncStorage.setItem(KEYS.XP, String(xp));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getTotalCompleted() {
  try {
    const data = await AsyncStorage.getItem(KEYS.TOTAL_COMPLETED);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveTotalCompleted(total) {
  try {
    await AsyncStorage.setItem(KEYS.TOTAL_COMPLETED, String(total));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getWeeksCompleted() {
  try {
    const data = await AsyncStorage.getItem(KEYS.WEEKS_COMPLETED);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveWeeksCompleted(weeks) {
  try {
    await AsyncStorage.setItem(KEYS.WEEKS_COMPLETED, String(weeks));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getLegDaysCompleted() {
  try {
    const data = await AsyncStorage.getItem(KEYS.LEG_DAYS);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveLegDaysCompleted(days) {
  try {
    await AsyncStorage.setItem(KEYS.LEG_DAYS, String(days));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getBadgesEarned() {
  try {
    const data = await AsyncStorage.getItem(KEYS.BADGES_EARNED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveBadgesEarned(badges) {
  try {
    await AsyncStorage.setItem(KEYS.BADGES_EARNED, JSON.stringify(badges));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getReplacements() {
  try {
    const data = await AsyncStorage.getItem(KEYS.REPLACEMENTS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export async function saveReplacements(replacements) {
  try {
    await AsyncStorage.setItem(KEYS.REPLACEMENTS, JSON.stringify(replacements));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function getNotificationsEnabled() {
  try {
    const data = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
    return data === 'true';
  } catch {
    return false;
  }
}

export async function saveNotificationsEnabled(enabled) {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, String(enabled));
    await syncRemote();
  } catch {
    // silently fail
  }
}

export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch {
    // silently fail
  }
}
