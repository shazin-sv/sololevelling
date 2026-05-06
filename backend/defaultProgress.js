function getDefaultProgress() {
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

module.exports = { getDefaultProgress };
