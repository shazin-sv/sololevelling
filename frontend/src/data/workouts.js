export const WEEK_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const WORKOUT_SCHEDULE = {
  Monday: {
    title: 'CHEST + TRICEPS',
    subtitle: 'CHEST SIZE + TRICEP GROWTH',
    color: '#E23636',
    accent: '#FFD700',
    exercises: [
      { id: 'm1', name: 'Bench Press', sets: '4×6–8', description: 'The king of chest builders. Focus on controlled descent.', targetMuscles: 'Chest, Front Delts, Triceps', youtubeQuery: 'bench press tutorial' },
      { id: 'm2', name: 'Incline Dumbbell Press', sets: '3×8–10', description: 'Hits upper chest for that shelf look.', targetMuscles: 'Upper Chest, Front Delts', youtubeQuery: 'incline dumbbell press tutorial' },
      { id: 'm3', name: 'Chest Fly', sets: '3×12', description: 'Squeeze at the peak for maximum chest contraction.', targetMuscles: 'Chest', youtubeQuery: 'chest fly tutorial' },
      { id: 'm4', name: 'Dips', sets: '3×10', description: 'Lean forward to hit chest, upright for triceps.', targetMuscles: 'Chest, Triceps', youtubeQuery: 'dips tutorial' },
      { id: 'm5', name: 'Tricep Pushdown', sets: '3×12', description: 'Lock elbows at sides and drive down hard.', targetMuscles: 'Triceps', youtubeQuery: 'tricep pushdown tutorial' },
      { id: 'm6', name: 'Overhead Tricep Extension', sets: '3×12', description: 'Stretch the long head of the triceps at the bottom.', targetMuscles: 'Triceps (Long Head)', youtubeQuery: 'overhead tricep extension tutorial' },
    ],
  },
  Tuesday: {
    title: 'BACK (WIDTH) + BICEPS',
    subtitle: 'WIDE V-TAPER BACK',
    color: '#1E90FF',
    accent: '#FFD700',
    exercises: [
      { id: 't1', name: 'Lat Pulldown', sets: '4×8', description: 'Pull to upper chest. Squeeze lats hard.', targetMuscles: 'Lats, Rear Delts', youtubeQuery: 'lat pulldown tutorial' },
      { id: 't2', name: 'Pull-ups', sets: '3 sets', description: 'Drive elbows down and back. Use assisted if needed.', targetMuscles: 'Lats, Biceps', youtubeQuery: 'pull ups tutorial' },
      { id: 't3', name: 'Straight Arm Pulldown', sets: '3×12', description: 'Isolate the lats with minimal bicep involvement.', targetMuscles: 'Lats', youtubeQuery: 'straight arm pulldown tutorial' },
      { id: 't4', name: 'Seated Cable Row', sets: '3×10', description: 'Pull with elbows tucked. Squeeze shoulder blades.', targetMuscles: 'Mid Back, Lats', youtubeQuery: 'seated cable row tutorial' },
      { id: 't5', name: 'Hammer Curl', sets: '3×12', description: 'Build thick forearms and brachialis.', targetMuscles: 'Brachialis, Forearms', youtubeQuery: 'hammer curl tutorial' },
      { id: 't6', name: 'Cable Curl', sets: '3×12', description: 'Constant tension on the biceps throughout the range.', targetMuscles: 'Biceps', youtubeQuery: 'cable curl tutorial' },
    ],
  },
  Wednesday: {
    title: 'SHOULDERS + UPPER BACK',
    subtitle: 'BROAD SHOULDERS + UPPER BACK DETAIL',
    color: '#FFD700',
    accent: '#E23636',
    exercises: [
      { id: 'w1', name: 'Overhead Shoulder Press', sets: '4×6–8', description: 'The overhead press builds massive front delts.', targetMuscles: 'Front Delts, Triceps, Upper Chest', youtubeQuery: 'overhead shoulder press tutorial' },
      { id: 'w2', name: 'Lateral Raises', sets: '4×12', description: 'Light weight, perfect form. Lead with elbows.', targetMuscles: 'Side Delts', youtubeQuery: 'lateral raises tutorial' },
      { id: 'w3', name: 'Rear Delt Fly', sets: '3×12', description: 'Bend over and squeeze rear delts at the top.', targetMuscles: 'Rear Delts', youtubeQuery: 'rear delt fly tutorial' },
      { id: 'w4', name: 'Cable Lateral Raise', sets: '3×12', description: 'Constant tension for side delt development.', targetMuscles: 'Side Delts', youtubeQuery: 'cable lateral raise tutorial' },
      { id: 'w5', name: 'Shrugs', sets: '3×12', description: 'Hold at the top for 1 second. Traps of steel.', targetMuscles: 'Traps', youtubeQuery: 'shrugs tutorial' },
      { id: 'w6', name: 'Face Pulls', sets: '3×12', description: 'Save your shoulders. Pull to forehead level.', targetMuscles: 'Rear Delts, Rotator Cuff', youtubeQuery: 'face pulls tutorial' },
    ],
  },
  Thursday: {
    title: 'BICEPS + ABS',
    subtitle: 'AESTHETIC ARMS + VISIBLE ABS',
    color: '#32CD32',
    accent: '#FFD700',
    exercises: [
      { id: 'th1', name: 'Barbell Curl', sets: '3×10', description: 'Strict form — no swinging. Full stretch and squeeze.', targetMuscles: 'Biceps', youtubeQuery: 'barbell curl tutorial' },
      { id: 'th2', name: 'Incline Dumbbell Curl', sets: '3×12', description: 'Stretched position hits the long head hard.', targetMuscles: 'Biceps (Long Head)', youtubeQuery: 'incline dumbbell curl tutorial' },
      { id: 'th3', name: 'Hammer Curl', sets: '3×12', description: 'Build thick forearms and brachialis.', targetMuscles: 'Brachialis, Forearms', youtubeQuery: 'hammer curl tutorial' },
      { id: 'th4', name: 'Hanging Leg Raises', sets: '3×15', description: 'Lift legs to 90 degrees. Control the descent.', targetMuscles: 'Abs, Hip Flexors', youtubeQuery: 'hanging leg raises tutorial' },
      { id: 'th5', name: 'Cable Crunches', sets: '3×15', description: 'Crunch down and squeeze abs hard.', targetMuscles: 'Abs', youtubeQuery: 'cable crunches tutorial' },
      { id: 'th6', name: 'Russian Twists', sets: '3×20', description: 'Rotate torso side to side. Keep core tight.', targetMuscles: 'Obliques, Core', youtubeQuery: 'russian twists tutorial' },
    ],
  },
  Friday: {
    title: 'LEGS + BACK THICKNESS',
    subtitle: 'LEGS + DENSE BACK',
    color: '#1E90FF',
    accent: '#E23636',
    exercises: [
      { id: 'f1', name: 'Romanian Deadlift', sets: '3×8', description: 'Hinge at hips. Feel the hamstring stretch.', targetMuscles: 'Hamstrings, Glutes, Lower Back', youtubeQuery: 'romanian deadlift tutorial' },
      { id: 'f2', name: 'Leg Press (light)', sets: '3×12', description: 'Control the weight. Focus on mind-muscle connection.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'leg press tutorial' },
      { id: 'f3', name: 'Walking Lunges', sets: '3×12', description: 'Keep torso upright. Long strides.', targetMuscles: 'Quads, Glutes, Hamstrings', youtubeQuery: 'walking lunges tutorial' },
      { id: 'f4', name: 'Chest-Supported Row', sets: '3×8–10', description: 'No momentum — pure back contraction.', targetMuscles: 'Mid Back, Rear Delts', youtubeQuery: 'chest supported row tutorial' },
      { id: 'f5', name: 'Seated Calf Raises', sets: '4×15', description: 'Slow tempo. Feel the burn in the soleus.', targetMuscles: 'Calves (Soleus)', youtubeQuery: 'seated calf raises tutorial' },
      { id: 'f6', name: 'Hip Thrust / Glute Bridge', sets: '3×12', description: 'Squeeze glutes hard at the top.', targetMuscles: 'Glutes, Hamstrings', youtubeQuery: 'hip thrust glute bridge tutorial' },
    ],
  },
  Saturday: {
    title: 'HEAVY LEGS',
    subtitle: 'STRENGTH + LEG GROWTH',
    color: '#E23636',
    accent: '#1E90FF',
    exercises: [
      { id: 's1', name: 'Squats', sets: '4×6–8', description: 'The big one. Go deep. Stay tight.', targetMuscles: 'Quads, Glutes, Lower Back', youtubeQuery: 'squats tutorial' },
      { id: 's2', name: 'Leg Press', sets: '3×10', description: 'Feet shoulder width. Control the weight.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'leg press tutorial' },
      { id: 's3', name: 'Leg Extension', sets: '3×12', description: 'Squeeze quads at the top. Slow negative.', targetMuscles: 'Quads', youtubeQuery: 'leg extension tutorial' },
      { id: 's4', name: 'Hamstring Curl', sets: '3×10', description: 'Control the negative. Squeeze hamstrings.', targetMuscles: 'Hamstrings', youtubeQuery: 'hamstring curl tutorial' },
      { id: 's5', name: 'Standing Calf Raises', sets: '4×15', description: 'Full range. Pause at top and bottom.', targetMuscles: 'Calves (Gastrocnemius)', youtubeQuery: 'standing calf raises tutorial' },
      { id: 's6', name: 'Bulgarian Split Squat', sets: '3×10', description: 'The pain is real. Embrace it.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'bulgarian split squat tutorial' },
    ],
  },
  Sunday: {
    title: 'REST DAY',
    subtitle: 'RECOVER LIKE A HERO',
    color: '#1E90FF',
    accent: '#FFD700',
    isRest: true,
    exercises: [],
    recoveryTips: [
      'Recovery',
      'Light walking',
      'Sleep well',
      'High protein meals',
    ],
  },
};

export const ALTERNATE_EXERCISES = {
  'Bench Press': [
    { name: 'Dumbbell Bench Press', sets: '4×8–10', description: 'More range of motion, great for chest development.' },
    { name: 'Machine Chest Press', sets: '4×10–12', description: 'Stable movement, good for beginners.' },
  ],
  'Pull-ups': [
    { name: 'Lat Pulldown (Neutral Grip)', sets: '4×10–12', description: 'Easier progression for building lat width.' },
    { name: 'Assisted Pull-Up Machine', sets: '4×8–10', description: 'Use assistance to build strength.' },
  ],
  'Squats': [
    { name: 'Hack Squat', sets: '4×8–10', description: 'Machine squat with back support.' },
    { name: 'Front Squat', sets: '4×6–8', description: 'Quad-dominant squat variation.' },
  ],
  'Overhead Shoulder Press': [
    { name: 'Dumbbell Shoulder Press', sets: '4×8–10', description: 'More shoulder-friendly range of motion.' },
    { name: 'Machine Shoulder Press', sets: '4×10–12', description: 'Stable overhead pressing movement.' },
  ],
  'Barbell Curl': [
    { name: 'Dumbbell Curl', sets: '3×10–12', description: 'Isolate each arm for balanced bicep development.' },
    { name: 'Cable Curl', sets: '3×12–15', description: 'Constant tension on the biceps.' },
  ],
  'Romanian Deadlift': [
    { name: 'Stiff-Leg Deadlift', sets: '3×8–10', description: 'Similar hamstring emphasis with slightly different mechanics.' },
    { name: 'Good Morning', sets: '3×10–12', description: 'Barbell on back, hinge at hips for hamstring focus.' },
  ],
};

export const BADGES = [
  { id: 'first_workout', name: 'FIRST WORKOUT', description: 'Complete your first exercise', icon: '⚡', condition: (stats) => stats.totalCompleted >= 1 },
  { id: 'seven_streak', name: '7 DAY STREAK', description: 'Work out 7 days in a row', icon: '🔥', condition: (stats) => stats.streak >= 7 },
  { id: 'thirty_streak', name: '30 DAY STREAK', description: 'Work out 30 days in a row', icon: '👑', condition: (stats) => stats.streak >= 30 },
  { id: 'century', name: 'CENTURY CLUB', description: 'Complete 100 exercises total', icon: '💯', condition: (stats) => stats.totalCompleted >= 100 },
  { id: 'full_week', name: 'FULL WEEK WARRIOR', description: 'Complete every day\'s workout in one week', icon: '🛡️', condition: (stats) => stats.weeksCompleted >= 1 },
  { id: 'leg_day', name: 'NEVER SKIP LEG DAY', description: 'Complete 10 leg day workouts', icon: '🦵', condition: (stats) => stats.legDaysCompleted >= 10 },
];

export const LEVELS = [
  { name: 'ROOKIE', xpRequired: 0, color: '#A0A0A0' },
  { name: 'SIDEKICK', xpRequired: 500, color: '#32CD32' },
  { name: 'HERO', xpRequired: 1500, color: '#1E90FF' },
  { name: 'SUPERHERO', xpRequired: 3500, color: '#FFD700' },
  { name: 'LEGEND', xpRequired: 7000, color: '#E23636' },
];

const EXERCISE_VISUALS = {
  chest: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200',
  back: 'https://images.pexels.com/photos/949129/pexels-photo-949129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  shoulders: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1200',
  arms: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
  legs: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1200',
  core: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1200',
  recovery: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export function getExerciseVisual(exercise = {}) {
  const text = `${exercise.name || ''} ${exercise.targetMuscles || ''}`.toLowerCase();

  if (text.includes('squat') || text.includes('leg') || text.includes('calf') || text.includes('lunge') || text.includes('glute') || text.includes('hamstring') || text.includes('quad')) {
    return EXERCISE_VISUALS.legs;
  }

  if (text.includes('bench') || text.includes('chest') || text.includes('fly') || text.includes('push-up')) {
    return EXERCISE_VISUALS.chest;
  }

  if (text.includes('row') || text.includes('lat') || text.includes('pull') || text.includes('back') || text.includes('trap')) {
    return EXERCISE_VISUALS.back;
  }

  if (text.includes('press') || text.includes('delt') || text.includes('shoulder') || text.includes('shrug')) {
    return EXERCISE_VISUALS.shoulders;
  }

  if (text.includes('curl') || text.includes('tricep') || text.includes('bicep') || text.includes('skull')) {
    return EXERCISE_VISUALS.arms;
  }

  if (text.includes('plank') || text.includes('core') || text.includes('abdominis')) {
    return EXERCISE_VISUALS.core;
  }

  return EXERCISE_VISUALS.recovery;
}
