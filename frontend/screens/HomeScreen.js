import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Daily workout content
  const todayWorkout = `BACK (THICKNESS) + BICEPS
THICK & STRONG`;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.banner}>HEROFIT</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => { /* Save logic */ }}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutTitle}>{todayWorkout}</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, {borderColor: '#2196F3'}]}>
            <Text style={styles.statNumber}>0/6</Text>
            <Text style={styles.statLabel}>0%</Text>
          </View>
          <View style={styles.streakContainer}>
            <View style={styles.streakIcon}>
              <Text style={styles.streakDays}>2</Text>
            </View>
            <Text style={styles.streakLabel}>DAY STREAK</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>START WORKOUT</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={[styles.statColumn, {borderColor: '#FFD700'}]}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statTitle}>WORKOUTS DONE</Text>
        </View>
        <View style={[styles.statColumn, {borderColor: '#FF6347'}]}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statTitle}>DAY STREAK</Text>
        </View>
      </View>

      <View style={styles.questLog}>
        <Text style={styles.questTitle}>TODAY'S QUEST LOG</Text>
        {['Barbell Row (4×6-8)', 'T-Bar Row (4×8-10)', 'Chest-Supported Row (3×10-12)'].map((item, index) => (
          <View key={index} style={styles.questItem}>
            <Text style={styles.questText}>⚡ {item.split('(')[0].trim()}</Text>
            <Text style={styles.questReps}>{item.split('(')[1]}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.weeklyButton}>
        <Text style={styles.weeklyButtonText}>SHOW WEEKLY SCHEDULE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  banner: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    color: '#2196F3',
    fontWeight: '600',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 15,
    top: 50,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    borderRadius: 8,
    width: 150,
    zIndex: 100,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  workoutHeader: {
    marginTop: 15,
    marginBottom: 25,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '30%',
  },
  statNumber: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    width: '30%',
  },
  streakIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  streakDays: {
    color: 'white',
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  startButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statColumn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statTitle: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 5,
  },
  questLog: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  questTitle: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  questText: {
    color: 'white',
  },
  questReps: {
    color: '#9E9E9E',
  },
  weeklyButton: {
    backgroundColor: '#2D2D2D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  weeklyButtonText: {
    color: '#9E9E9E',
    fontSize: 12,
  },
});