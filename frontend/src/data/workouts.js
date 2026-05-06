export const WEEK_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const WORKOUT_SCHEDULE = {
  Monday: {
    title: 'CHEST + TRICEPS',
    subtitle: 'UPPER BODY POWER',
    color: '#E23636',
    accent: '#FFD700',
    exercises: [
      { id: 'm1', name: 'Barbell Bench Press', sets: '4×6–8', description: 'The king of chest builders. Focus on controlled descent.', targetMuscles: 'Chest, Front Delts, Triceps', youtubeQuery: 'barbell bench press tutorial' },
      { id: 'm2', name: 'Incline Dumbbell Press', sets: '3×8–10', description: 'Hits upper chest for that shelf look.', targetMuscles: 'Upper Chest, Front Delts', youtubeQuery: 'incline dumbbell press tutorial' },
      { id: 'm3', name: 'Cable Fly (Low to High)', sets: '3×12–15', description: 'Squeeze at the top for maximum contraction.', targetMuscles: 'Upper Chest', youtubeQuery: 'cable fly low to high tutorial' },
      { id: 'm4', name: 'Close-Grip Bench Press', sets: '3×8–10', description: 'Keep elbows tucked to smash the triceps.', targetMuscles: 'Triceps, Chest', youtubeQuery: 'close grip bench press tutorial' },
      { id: 'm5', name: 'Tricep Rope Pushdown', sets: '3×12–15', description: 'Split the rope at the bottom. Squeeze!', targetMuscles: 'Triceps', youtubeQuery: 'tricep rope pushdown tutorial' },
      { id: 'm6', name: 'Overhead Dumbbell Extension', sets: '3×10–12', description: 'Stretch the long head of the triceps.', targetMuscles: 'Triceps (Long Head)', youtubeQuery: 'overhead dumbbell extension tutorial' },
    ],
  },
  Tuesday: {
    title: 'BACK (WIDTH) + BICEPS',
    subtitle: 'BUILD THE V-TAPER',
    color: '#1E90FF',
    accent: '#FFD700',
    exercises: [
      { id: 't1', name: 'Pull-Ups (Weighted)', sets: '4×6–10', description: 'Drive elbows down and back. Add weight if possible.', targetMuscles: 'Lats, Biceps', youtubeQuery: 'weighted pull ups tutorial' },
      { id: 't2', name: 'Lat Pulldown (Wide Grip)', sets: '4×8–10', description: 'Pull to upper chest. Squeeze lats hard.', targetMuscles: 'Lats, Rear Delts', youtubeQuery: 'lat pulldown wide grip tutorial' },
      { id: 't3', name: 'Straight-Arm Pulldown', sets: '3×12–15', description: 'Isolate the lats with minimal bicep involvement.', targetMuscles: 'Lats', youtubeQuery: 'straight arm pulldown tutorial' },
      { id: 't4', name: 'Barbell Curl', sets: '3×8–10', description: 'Strict form — no swinging. Full stretch and squeeze.', targetMuscles: 'Biceps', youtubeQuery: 'barbell curl tutorial' },
      { id: 't5', name: 'Incline Dumbbell Curl', sets: '3×10–12', description: 'Stretched position hits the long head hard.', targetMuscles: 'Biceps (Long Head)', youtubeQuery: 'incline dumbbell curl tutorial' },
      { id: 't6', name: 'Hammer Curl', sets: '3×12 each', description: 'Build thick forearms and brachialis.', targetMuscles: 'Brachialis, Forearms', youtubeQuery: 'hammer curl tutorial' },
    ],
  },
  Wednesday: {
    title: 'SHOULDERS + TRICEPS',
    subtitle: 'CAP THE DELTS',
    color: '#FFD700',
    accent: '#E23636',
    exercises: [
      { id: 'w1', name: 'Overhead Press (Barbell)', sets: '4×6–8', description: 'The overhead press builds massive front delts.', targetMuscles: 'Front Delts, Triceps, Upper Chest', youtubeQuery: 'overhead press barbell tutorial' },
      { id: 'w2', name: 'Dumbbell Lateral Raise', sets: '4×12–15', description: 'Light weight, perfect form. Lead with elbows.', targetMuscles: 'Side Delts', youtubeQuery: 'dumbbell lateral raise tutorial' },
      { id: 'w3', name: 'Cable Face Pull', sets: '3×15–20', description: 'Save your shoulders. Pull to forehead level.', targetMuscles: 'Rear Delts, Rotator Cuff', youtubeQuery: 'cable face pull tutorial' },
      { id: 'w4', name: 'Dumbbell Shrugs', sets: '3×12–15', description: 'Hold at the top for 1 second. traps of steel.', targetMuscles: 'Traps', youtubeQuery: 'dumbbell shrugs tutorial' },
      { id: 'w5', name: 'Skull Crushers', sets: '3×10–12', description: 'Lower behind your head, not to your face.', targetMuscles: 'Triceps', youtubeQuery: 'skull crushers tutorial' },
      { id: 'w6', name: 'Diamond Push-Ups', sets: '3×failure', description: 'Bodyweight finisher for the triceps.', targetMuscles: 'Triceps, Chest', youtubeQuery: 'diamond push ups tutorial' },
    ],
  },
  Thursday: {
    title: 'BACK (THICKNESS) + BICEPS',
    subtitle: 'THICK & STRONG',
    color: '#1E90FF',
    accent: '#FFD700',
    exercises: [
      { id: 'th1', name: 'Barbell Row', sets: '4×6–8', description: 'Pull to lower abs. Keep back flat.', targetMuscles: 'Lats, Rhomboids, Lower Traps', youtubeQuery: 'barbell row tutorial' },
      { id: 'th2', name: 'T-Bar Row', sets: '4×8–10', description: 'Thickens the entire back. Wide grip variant.', targetMuscles: 'Mid Back, Lats', youtubeQuery: 't bar row tutorial' },
      { id: 'th3', name: 'Chest-Supported Row', sets: '3×10–12', description: 'No momentum — pure back contraction.', targetMuscles: 'Mid Back, Rear Delts', youtubeQuery: 'chest supported row tutorial' },
      { id: 'th4', name: 'Rack Pulls', sets: '3×5–6', description: 'Short range deadlift. Overload the upper back.', targetMuscles: 'Traps, Lats, Lower Back', youtubeQuery: 'rack pulls tutorial' },
      { id: 'th5', name: 'Preacher Curl', sets: '3×8–10', description: 'Strict form. No swinging allowed.', targetMuscles: 'Biceps (Short Head)', youtubeQuery: 'preacher curl tutorial' },
      { id: 'th6', name: 'Concentration Curl', sets: '3×10–12 each', description: 'Peak contraction. Arnold\'s favorite.', targetMuscles: 'Biceps', youtubeQuery: 'concentration curl tutorial' },
    ],
  },
  Friday: {
    title: 'LEGS (LIGHT)',
    subtitle: 'ACTIVE RECOVERY DAY',
    color: '#32CD32',
    accent: '#FFD700',
    exercises: [
      { id: 'f1', name: 'Goblet Squat', sets: '3×12–15', description: 'Deep squat. Hold dumbbell at chest.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'goblet squat tutorial' },
      { id: 'f2', name: 'Leg Press (Feet High)', sets: '3×15–20', description: 'High foot placement hits hamstrings and glutes.', targetMuscles: 'Hamstrings, Glutes', youtubeQuery: 'leg press feet high tutorial' },
      { id: 'f3', name: 'Walking Lunges', sets: '3×20 steps', description: 'Keep torso upright. Long strides.', targetMuscles: 'Quads, Glutes, Hamstrings', youtubeQuery: 'walking lunges tutorial' },
      { id: 'f4', name: 'Leg Curl (Seated)', sets: '3×12–15', description: 'Control the negative. Squeeze hamstrings.', targetMuscles: 'Hamstrings', youtubeQuery: 'seated leg curl tutorial' },
      { id: 'f5', name: 'Calf Raises (Standing)', sets: '4×15–20', description: 'Full range. Pause at top and bottom.', targetMuscles: 'Calves (Gastrocnemius)', youtubeQuery: 'standing calf raises tutorial' },
      { id: 'f6', name: 'Plank', sets: '3×60 sec', description: 'Brace your core. Breathe normally.', targetMuscles: 'Core, Transverse Abdominis', youtubeQuery: 'plank exercise tutorial' },
    ],
  },
  Saturday: {
    title: 'LEGS (HEAVY)',
    subtitle: 'LEG DAY DESTROYER',
    color: '#E23636',
    accent: '#1E90FF',
    exercises: [
      { id: 's1', name: 'Barbell Back Squat', sets: '4×5–6', description: 'The big one. Go deep. Stay tight.', targetMuscles: 'Quads, Glutes, Lower Back', youtubeQuery: 'barbell back squat tutorial' },
      { id: 's2', name: 'Romanian Deadlift', sets: '4×6–8', description: 'Hinge at hips. Feel the hamstring stretch.', targetMuscles: 'Hamstrings, Glutes, Lower Back', youtubeQuery: 'romanian deadlift tutorial' },
      { id: 's3', name: 'Leg Press', sets: '3×8–10', description: 'Feet shoulder width. Control the weight.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'leg press tutorial' },
      { id: 's4', name: 'Bulgarian Split Squat', sets: '3×8–10 each', description: 'The pain is real. Embrace it.', targetMuscles: 'Quads, Glutes', youtubeQuery: 'bulgarian split squat tutorial' },
      { id: 's5', name: 'Leg Extension', sets: '3×12–15', description: 'Squeeze quads at the top. Slow negative.', targetMuscles: 'Quads', youtubeQuery: 'leg extension tutorial' },
      { id: 's6', name: 'Seated Calf Raise', sets: '4×12–15', description: 'Slow tempo. Feel the burn.', targetMuscles: 'Calves (Soleus)', youtubeQuery: 'seated calf raise tutorial' },
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
      'Sleep 7–9 hours for maximum recovery.',
      'Eat 1g protein per pound of bodyweight.',
      'Drink 3L+ water today.',
      'Stretch hips and lower back for 10 minutes.',
      'Foam roll quads and lats.',
      'Plan your meals for the upcoming week.',
    ],
  },
};

export const ALTERNATE_EXERCISES = {
  'Barbell Bench Press': [
    { name: 'Dumbbell Bench Press', sets: '4×8–10', description: 'More range of motion, great for chest development.' },
    { name: 'Machine Chest Press', sets: '4×10–12', description: 'Stable movement, good for beginners.' },
  ],
  'Pull-Ups (Weighted)': [
    { name: 'Lat Pulldown (Neutral Grip)', sets: '4×10–12', description: 'Easier progression for building lat width.' },
    { name: 'Assisted Pull-Up Machine', sets: '4×8–10', description: 'Use assistance to build strength.' },
  ],
  'Barbell Back Squat': [
    { name: 'Hack Squat', sets: '4×8–10', description: 'Machine squat with back support.' },
    { name: 'Front Squat', sets: '4×6–8', description: 'Quad-dominant squat variation.' },
  ],
  'Overhead Press (Barbell)': [
    { name: 'Dumbbell Shoulder Press', sets: '4×8–10', description: 'More shoulder-friendly range of motion.' },
    { name: 'Machine Shoulder Press', sets: '4×10–12', description: 'Stable overhead pressing movement.' },
  ],
  'Barbell Row': [
    { name: 'Seal Row', sets: '4×8–10', description: 'Chest-supported row on a flat bench.' },
    { name: 'Machine Row', sets: '4×10–12', description: 'Stable rowing movement with chest support.' },
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
