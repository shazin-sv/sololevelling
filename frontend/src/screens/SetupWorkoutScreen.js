import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as XLSX from 'xlsx';
import { saveWorkoutPlan } from '../utils/auth';
import { WORKOUT_SCHEDULE } from '../data/workouts';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

const DAY_COLORS = {
  Monday: '#E23636',
  Tuesday: '#1E90FF',
  Wednesday: '#FFD700',
  Thursday: '#32CD32',
  Friday: '#1E90FF',
  Saturday: '#E23636',
  Sunday: '#1E90FF',
};

const DAY_ACCENTS = {
  Monday: '#FFD700',
  Tuesday: '#FFD700',
  Wednesday: '#E23636',
  Thursday: '#FFD700',
  Friday: '#E23636',
  Saturday: '#1E90FF',
  Sunday: '#FFD700',
};

export default function SetupWorkoutScreen({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  function generateTemplate() {
    const rows = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 1, 'Exercise Name': 'Bench Press', Sets: '4x6-8', Description: 'King of chest builders', 'Target Muscles': 'Chest, Triceps' });
    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 2, 'Exercise Name': 'Incline Dumbbell Press', Sets: '3x8-10', Description: 'Upper chest focus', 'Target Muscles': 'Upper Chest' });
    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 3, 'Exercise Name': 'Chest Fly', Sets: '3x12', Description: 'Squeeze at peak', 'Target Muscles': 'Chest' });
    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 4, 'Exercise Name': 'Dips', Sets: '3x10', Description: 'Lean forward for chest', 'Target Muscles': 'Chest, Triceps' });
    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 5, 'Exercise Name': 'Tricep Pushdown', Sets: '3x12', Description: 'Lock elbows at sides', 'Target Muscles': 'Triceps' });
    rows.push({ Day: 'Monday', Title: 'Chest + Triceps', 'Exercise #': 6, 'Exercise Name': 'Overhead Tricep Extension', Sets: '3x12', Description: 'Stretch the long head', 'Target Muscles': 'Triceps' });

    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 1, 'Exercise Name': 'Lat Pulldown', Sets: '4x8', Description: 'Pull to upper chest', 'Target Muscles': 'Lats' });
    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 2, 'Exercise Name': 'Pull-ups', Sets: '3 sets', Description: 'Drive elbows down', 'Target Muscles': 'Lats, Biceps' });
    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 3, 'Exercise Name': 'Straight Arm Pulldown', Sets: '3x12', Description: 'Isolate lats', 'Target Muscles': 'Lats' });
    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 4, 'Exercise Name': 'Seated Cable Row', Sets: '3x10', Description: 'Squeeze shoulder blades', 'Target Muscles': 'Mid Back' });
    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 5, 'Exercise Name': 'Hammer Curl', Sets: '3x12', Description: 'Thick forearms', 'Target Muscles': 'Brachialis' });
    rows.push({ Day: 'Tuesday', Title: 'Back (Width) + Biceps', 'Exercise #': 6, 'Exercise Name': 'Cable Curl', Sets: '3x12', Description: 'Constant tension', 'Target Muscles': 'Biceps' });

    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 1, 'Exercise Name': 'Overhead Shoulder Press', Sets: '4x6-8', Description: 'Build massive delts', 'Target Muscles': 'Front Delts' });
    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 2, 'Exercise Name': 'Lateral Raises', Sets: '4x12', Description: 'Lead with elbows', 'Target Muscles': 'Side Delts' });
    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 3, 'Exercise Name': 'Rear Delt Fly', Sets: '3x12', Description: 'Squeeze rear delts', 'Target Muscles': 'Rear Delts' });
    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 4, 'Exercise Name': 'Cable Lateral Raise', Sets: '3x12', Description: 'Constant tension', 'Target Muscles': 'Side Delts' });
    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 5, 'Exercise Name': 'Shrugs', Sets: '3x12', Description: 'Hold at top 1 sec', 'Target Muscles': 'Traps' });
    rows.push({ Day: 'Wednesday', Title: 'Shoulders + Upper Back', 'Exercise #': 6, 'Exercise Name': 'Face Pulls', Sets: '3x12', Description: 'Pull to forehead', 'Target Muscles': 'Rear Delts' });

    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 1, 'Exercise Name': 'Barbell Curl', Sets: '3x10', Description: 'Strict form no swing', 'Target Muscles': 'Biceps' });
    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 2, 'Exercise Name': 'Incline Dumbbell Curl', Sets: '3x12', Description: 'Long head stretch', 'Target Muscles': 'Biceps' });
    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 3, 'Exercise Name': 'Hammer Curl', Sets: '3x12', Description: 'Thick forearms', 'Target Muscles': 'Brachialis' });
    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 4, 'Exercise Name': 'Hanging Leg Raises', Sets: '3x15', Description: 'Lift to 90 degrees', 'Target Muscles': 'Abs' });
    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 5, 'Exercise Name': 'Cable Crunches', Sets: '3x15', Description: 'Crunch and squeeze', 'Target Muscles': 'Abs' });
    rows.push({ Day: 'Thursday', Title: 'Biceps + Abs', 'Exercise #': 6, 'Exercise Name': 'Russian Twists', Sets: '3x20', Description: 'Rotate side to side', 'Target Muscles': 'Obliques' });

    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 1, 'Exercise Name': 'Romanian Deadlift', Sets: '3x8', Description: 'Hinge at hips', 'Target Muscles': 'Hamstrings' });
    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 2, 'Exercise Name': 'Leg Press', Sets: '3x12', Description: 'Mind muscle connection', 'Target Muscles': 'Quads' });
    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 3, 'Exercise Name': 'Walking Lunges', Sets: '3x12', Description: 'Long strides', 'Target Muscles': 'Quads, Glutes' });
    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 4, 'Exercise Name': 'Chest-Supported Row', Sets: '3x8-10', Description: 'Pure back contraction', 'Target Muscles': 'Mid Back' });
    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 5, 'Exercise Name': 'Seated Calf Raises', Sets: '4x15', Description: 'Slow tempo', 'Target Muscles': 'Calves' });
    rows.push({ Day: 'Friday', Title: 'Legs + Back Thickness', 'Exercise #': 6, 'Exercise Name': 'Hip Thrust', Sets: '3x12', Description: 'Squeeze glutes hard', 'Target Muscles': 'Glutes' });

    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 1, 'Exercise Name': 'Squats', Sets: '4x6-8', Description: 'Go deep stay tight', 'Target Muscles': 'Quads' });
    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 2, 'Exercise Name': 'Leg Press', Sets: '3x10', Description: 'Control the weight', 'Target Muscles': 'Quads' });
    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 3, 'Exercise Name': 'Leg Extension', Sets: '3x12', Description: 'Squeeze at top', 'Target Muscles': 'Quads' });
    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 4, 'Exercise Name': 'Hamstring Curl', Sets: '3x10', Description: 'Control the negative', 'Target Muscles': 'Hamstrings' });
    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 5, 'Exercise Name': 'Standing Calf Raises', Sets: '4x15', Description: 'Full range pause', 'Target Muscles': 'Calves' });
    rows.push({ Day: 'Saturday', Title: 'Heavy Legs', 'Exercise #': 6, 'Exercise Name': 'Bulgarian Split Squat', Sets: '3x10', Description: 'Embrace the pain', 'Target Muscles': 'Quads' });

    rows.push({ Day: 'Sunday', Title: 'Rest Day', 'Exercise #': '', 'Exercise Name': '', Sets: '', Description: 'Recovery, light walking, sleep well', 'Target Muscles': '' });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workout Plan');
    XLSX.writeFile(wb, 'herofit-workout-template.xlsx');
  }

  function parseWorkbook(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    const plan = {};
    const dayGroups = {};

    for (const row of rows) {
      const day = row['Day']?.toString().trim();
      if (!day) continue;

      if (!dayGroups[day]) {
        dayGroups[day] = {
          title: row['Title']?.toString().trim() || day,
          subtitle: '',
          exercises: [],
        };
      }

      const exNum = row['Exercise #'];
      const name = row['Exercise Name']?.toString().trim();
      if (!exNum || !name) continue;

      const prefix = day.slice(0, 2).toLowerCase();
      const id = `${prefix}${exNum}`;

      dayGroups[day].exercises.push({
        id,
        name,
        sets: row['Sets']?.toString().trim() || '',
        description: row['Description']?.toString().trim() || '',
        targetMuscles: row['Target Muscles']?.toString().trim() || '',
        youtubeQuery: `${name} tutorial`,
      });
    }

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of dayOrder) {
      const group = dayGroups[day];
      if (!group) continue;

      const isRest = group.exercises.length === 0;
      plan[day] = {
        title: group.title.toUpperCase(),
        subtitle: isRest ? 'RECOVER LIKE A HERO' : 'CUSTOM WORKOUT',
        color: DAY_COLORS[day] || '#1E90FF',
        accent: DAY_ACCENTS[day] || '#FFD700',
        isRest,
        exercises: isRest ? [] : group.exercises,
        recoveryTips: isRest ? ['Recovery', 'Light walking', 'Sleep well', 'High protein meals'] : undefined,
      };
    }

    return plan;
  }

  async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const plan = parseWorkbook(arrayBuffer);

      if (Object.keys(plan).length === 0) {
        throw new Error('Could not parse workout plan. Check the template format.');
      }

      await saveWorkoutPlan(plan);
      setSuccess('Workout plan saved! Loading your new schedule...');
      setTimeout(() => onComplete?.(plan), 1000);
    } catch (err) {
      setError(err.message || 'Failed to process file');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleUseDefault() {
    setLoading(true);
    setError('');
    try {
      await saveWorkoutPlan(WORKOUT_SCHEDULE);
      onComplete?.(WORKOUT_SCHEDULE);
    } catch (err) {
      setError(err.message || 'Failed to save default plan');
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SETUP YOUR PLAN</Text>
        </View>

        <Text style={styles.title}>LOAD YOUR WORKOUT PLAN</Text>

        <Text style={styles.body}>
          Download the template, fill it with your exercises for each day, then upload it back.
        </Text>

        <TouchableOpacity onPress={generateTemplate} style={[styles.button, styles.downloadBtn]}>
          <Text style={styles.buttonText}>⬇ DOWNLOAD TEMPLATE</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {Platform.OS === 'web' && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <TouchableOpacity
              onPress={() => fileInputRef.current?.click()}
              disabled={loading}
              style={[styles.button, styles.uploadBtn]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>⬆ UPLOAD YOUR PLAN</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity onPress={handleUseDefault} disabled={loading} style={[styles.button, styles.defaultBtn]}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>USE DEFAULT PLAN</Text>
          )}
        </TouchableOpacity>
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
    padding: SPACING.xl,
    paddingBottom: 56,
    alignItems: 'center',
    ...Platform.select({ web: { minHeight: '100%' } }),
  },
  badge: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  badgeText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.tiny,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.md,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  body: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    lineHeight: TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    maxWidth: 460,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  button: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: SPACING.md,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
  },
  downloadBtn: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.medium,
  },
  uploadBtn: {
    backgroundColor: COLORS.muted,
    ...SHADOWS.medium,
  },
  defaultBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  buttonText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginVertical: SPACING.lg,
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: BORDERS.default,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  error: {
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.weightBlack,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.bodySmall,
  },
  success: {
    color: COLORS.secondary,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.weightBlack,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.bodySmall,
  },
});
