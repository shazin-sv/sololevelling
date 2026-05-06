import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { WEEK_DAYS, WORKOUT_SCHEDULE, BADGES, LEVELS } from '../data/workouts';
import * as Storage from '../utils/storage';

const AppContext = createContext();

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDayName() {
  return WEEK_DAYS[new Date().getDay()];
}

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

function getNextLevel(xp) {
  const current = getLevel(xp);
  const idx = LEVELS.findIndex((l) => l.name === current.name);
  return LEVELS[idx + 1] || null;
}

function getXPProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 1;
  const range = next.xpRequired - current.xpRequired;
  const earned = xp - current.xpRequired;
  return Math.max(0, Math.min(1, earned / range));
}

function getMotivationalMessage(completed, total) {
  if (total === 0) return 'REST DAY! RECOVER AND GROW.';
  if (completed === 0) return 'TIME TO BECOME A LEGEND!';
  if (completed === total) return 'WORKOUT COMPLETE! YOU ARE UNSTOPPABLE!';
  if (completed / total >= 0.5) return 'HALFWAY THERE! KEEP PUSHING!';
  return 'EVERY REP COUNTS! STAY STRONG!';
}

function normalizeCompletedMap(completed) {
  if (!completed || typeof completed !== 'object') return {};

  return Object.fromEntries(
    Object.entries(completed).map(([dayKey, exerciseMap]) => {
      if (!exerciseMap || typeof exerciseMap !== 'object') {
        return [dayKey, {}];
      }

      const normalized = Object.fromEntries(
        Object.entries(exerciseMap)
          .map(([exerciseId, value]) => {
            if (value === true || value === 'complete') return [exerciseId, 'complete'];
            if (value === 'skip') return [exerciseId, 'skip'];
            return null;
          })
          .filter(Boolean)
      );

      return [dayKey, normalized];
    })
  );
}

function getExerciseStatus(value) {
  if (value === true || value === 'complete') return 'complete';
  if (value === 'skip') return 'skip';
  return null;
}

const initialState = {
  completed: {},
  streak: 0,
  lastWorkoutDate: null,
  xp: 0,
  totalCompleted: 0,
  weeksCompleted: 0,
  legDaysCompleted: 0,
  badgesEarned: [],
  replacements: {},
  today: getDayName(),
  todayKey: getTodayKey(),
  notificationsEnabled: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, completed: normalizeCompletedMap(action.payload.completed) };
    case 'DECIDE_EXERCISE': {
      const { exerciseId, decision } = action.payload;
      const todayCompleted = { ...(state.completed[state.todayKey] || {}) };
      if (todayCompleted[exerciseId]) return state;

      todayCompleted[exerciseId] = decision;
      const newCompleted = { ...state.completed, [state.todayKey]: todayCompleted };
      const xpDelta = decision === 'complete' ? 50 : -50;
      const totalDelta = decision === 'complete' ? 1 : 0;

      return {
        ...state,
        completed: newCompleted,
        totalCompleted: state.totalCompleted + totalDelta,
        xp: state.xp + xpDelta,
      };
    }
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload.streak, lastWorkoutDate: action.payload.date };
    case 'UPDATE_BADGES':
      return { ...state, badgesEarned: action.payload };
    case 'REPLACE_EXERCISE': {
      const { day, exerciseIndex, replacement } = action.payload;
      const key = `${day}_${exerciseIndex}`;
      return { ...state, replacements: { ...state.replacements, [key]: replacement } };
    }
    case 'RESET_DAY': {
      const newCompleted = { ...state.completed };
      delete newCompleted[state.todayKey];
      return { ...state, completed: newCompleted };
    }
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children, session = null, setSession = null }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function load() {
      const [
        completed,
        streak,
        lastDate,
        xp,
        total,
        weeks,
        legDays,
        badges,
        replacements,
        notifs,
      ] = await Promise.all([
        Storage.getCompletedExercises(),
        Storage.getStreak(),
        Storage.getLastWorkoutDate(),
        Storage.getXP(),
        Storage.getTotalCompleted(),
        Storage.getWeeksCompleted(),
        Storage.getLegDaysCompleted(),
        Storage.getBadgesEarned(),
        Storage.getReplacements(),
        Storage.getNotificationsEnabled(),
      ]);
      dispatch({
        type: 'INIT',
        payload: {
          completed,
          streak,
          lastWorkoutDate: lastDate,
          xp,
          totalCompleted: total,
          weeksCompleted: weeks,
          legDaysCompleted: legDays,
          badgesEarned: badges,
          replacements,
          notificationsEnabled: notifs,
        },
      });
    }
    load();
  }, []);

  useEffect(() => {
    Storage.saveCompletedExercises(state.completed);
    Storage.saveXP(state.xp);
    Storage.saveTotalCompleted(state.totalCompleted);
    Storage.saveBadgesEarned(state.badgesEarned);
    Storage.saveReplacements(state.replacements);
  }, [state.completed, state.xp, state.totalCompleted, state.badgesEarned, state.replacements]);

  const decideExercise = useCallback(
    async (exerciseId, decision = 'complete') => {
      const alreadyDecided = state.completed[state.todayKey]?.[exerciseId];
      if (alreadyDecided) return;

      dispatch({ type: 'DECIDE_EXERCISE', payload: { exerciseId, decision } });

      if (decision !== 'complete') return;

      const today = getTodayKey();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      const last = state.lastWorkoutDate;
      let newStreak = state.streak;
      if (last === yKey) {
        newStreak = state.streak + 1;
      } else if (last !== today) {
        newStreak = 1;
      }
      if (last !== today) {
        dispatch({ type: 'UPDATE_STREAK', payload: { streak: newStreak, date: today } });
        await Storage.saveStreak(newStreak);
        await Storage.saveLastWorkoutDate(today);
      }

      const stats = {
        streak: newStreak,
        totalCompleted: state.totalCompleted + 1,
        weeksCompleted: state.weeksCompleted,
        legDaysCompleted: state.legDaysCompleted,
      };
      const newBadges = [];
      for (const badge of BADGES) {
        if (!state.badgesEarned.includes(badge.id) && badge.condition(stats)) {
          newBadges.push(badge.id);
        }
      }
      if (newBadges.length > 0) {
        dispatch({ type: 'UPDATE_BADGES', payload: [...state.badgesEarned, ...newBadges] });
      }
    },
    [state]
  );

  const completeExercise = useCallback(
    async (exerciseId) => {
      await decideExercise(exerciseId, 'complete');
    },
    [decideExercise]
  );

  const replaceExercise = useCallback((day, exerciseIndex, replacement) => {
    dispatch({ type: 'REPLACE_EXERCISE', payload: { day, exerciseIndex, replacement } });
  }, []);

  const resetDay = useCallback(() => {
    dispatch({ type: 'RESET_DAY' });
  }, []);

  const toggleNotifications = useCallback(async () => {
    const next = !state.notificationsEnabled;
    dispatch({ type: 'TOGGLE_NOTIFICATIONS', payload: next });
    await Storage.saveNotificationsEnabled(next);
  }, [state.notificationsEnabled]);

  const todayWorkout = WORKOUT_SCHEDULE[state.today] || WORKOUT_SCHEDULE.Monday;
  const todayExercises = todayWorkout.exercises.map((ex, i) => {
    const key = `${state.today}_${i}`;
    return state.replacements[key] || ex;
  });
  const todayStatuses = Object.values(state.completed[state.todayKey] || {});
  const todayCompletedCount = todayStatuses.filter((value) => getExerciseStatus(value) === 'complete').length;
  const todayDecisionCount = todayStatuses.filter(Boolean).length;
  const todayTotal = todayExercises.length;
  const level = getLevel(state.xp);
  const nextLevel = getNextLevel(state.xp);
  const xpProgress = getXPProgress(state.xp);

  const value = {
    ...state,
    session,
    user: session?.user || null,
    setSession,
    todayWorkout,
    todayExercises,
    todayCompletedCount,
    todayDecisionCount,
    todayTotal,
    level,
    nextLevel,
    xpProgress,
    getExerciseStatus,
    getMotivationalMessage: () => getMotivationalMessage(todayCompletedCount, todayTotal),
    decideExercise,
    completeExercise,
    replaceExercise,
    resetDay,
    toggleNotifications,
    WORKOUT_SCHEDULE,
    WEEK_DAYS,
    BADGES,
    LEVELS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
