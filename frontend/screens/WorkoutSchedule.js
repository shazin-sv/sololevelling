import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutSchedule() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workoutData = `Monday – Chest + Triceps

1. Bench Press – 4×6–8
2. Incline Dumbbell Press – 3×8–10
3. Chest Fly – 3×12
4. Dips – 3×10
5. Tricep Pushdown – 3×12
6. Overhead Tricep Extension – 3×12

👉 Focus: Chest size + tricep growth

⸻

Tuesday – Back (Width) + Biceps

1. Lat Pulldown – 4×8
2. Pull-ups – 3 sets
3. Straight Arm Pulldown – 3×12
4. Seated Cable Row – 3×10
5. Hammer Curl – 3×12
6. Cable Curl – 3×12

👉 Focus: Wide V-taper back

⸻

Wednesday – Shoulders + Upper Back

1. Overhead Shoulder Press – 4×6–8
2. Lateral Raises – 4×12
3. Rear Delt Fly – 3×12
4. Cable Lateral Raise – 3×12
5. Shrugs – 3×12
6. Face Pulls – 3×12

👉 Focus: Broad shoulders + upper back detail

⸻

Thursday – Biceps + Abs

1. Barbell Curl – 3×10
2. Incline Dumbbell Curl – 3×12
3. Hammer Curl – 3×12
4. Hanging Leg Raises – 3×15
5. Cable Crunches – 3×15
6. Russian Twists – 3×20

👉 Focus: Aesthetic arms + visible abs

⸻

Friday – Legs + Back Thickness

1. Romanian Deadlift – 3×8
2. Leg Press (light) – 3×12
3. Walking Lunges – 3×12
4. Chest-Supported Row – 3×8–10
5. Seated Calf Raises – 4×15
6. Hip Thrust / Glute Bridge – 3×12

👉 Focus: Legs + dense back

⸻

Saturday – Heavy Legs

1. Squats – 4×6–8
2. Leg Press – 3×10
3. Leg Extension – 3×12
4. Hamstring Curl – 3×10
5. Standing Calf Raises – 4×15
6. Bulgarian Split Squat – 3×10

👉 Focus: Strength + leg growth

⸻

Sunday – Rest

* Recovery
* Light walking
* Sleep well
* High protein meals`;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.banner}>HEROFIT</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => { /* Save logic */ }}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Edit Schedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content}>
        <Text style={styles.workoutText}>{workoutData}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  banner: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  saveButton: {
    color: '#2196F3',
    fontWeight: '600',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 15,
    top: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  workoutText: {
    lineHeight: 24,
    fontSize: 16,
  },
});