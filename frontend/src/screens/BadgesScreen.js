import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import ComicPanel, { SoundEffect } from '../components/ComicPanel';

export default function BadgesScreen({ navigation }) {
  const { BADGES, badgesEarned, xp, level, streak, totalCompleted } = useApp();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <SoundEffect text="BADGES!" color="#FFD700" />
        </View>

        {/* STATS SUMMARY */}
        <ComicPanel
          color="#2C2C2C"
          borderColor="#FFD700"
          title="HERO STATS"
          titleColor="#FFD700"
        >
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>STREAK</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>DONE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{badgesEarned.length}</Text>
              <Text style={styles.statLabel}>BADGES</Text>
            </View>
          </View>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>RANK:</Text>
            <Text style={[styles.levelValue, { color: level.color }]}>{level.name}</Text>
          </View>
        </ComicPanel>

        {/* BADGES LIST */}
        {BADGES.map((badge) => {
          const earned = badgesEarned.includes(badge.id);
          return (
            <ComicPanel
              key={badge.id}
              color={earned ? '#2C2C2C' : '#1A1A1A'}
              borderColor={earned ? '#FFD700' : '#444444'}
              style={{ marginTop: 10, opacity: earned ? 1 : 0.5 }}
            >
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: earned ? '#FFD700' : '#333333' },
                  ]}
                >
                  <Text style={styles.badgeIconText}>{badge.icon}</Text>
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={[styles.badgeName, { color: earned ? '#FFD700' : '#666666' }]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                </View>
                {earned && (
                  <View style={styles.earnedMark}>
                    <Text style={styles.earnedText}>✓</Text>
                  </View>
                )}
              </View>
            </ComicPanel>
          );
        })}
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
  backBtn: {
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 10,
  },
  levelLabel: {
    color: '#AAAAAA',
    fontWeight: '800',
    fontSize: 12,
    marginRight: 6,
  },
  levelValue: {
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badgeIconText: {
    fontSize: 22,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  badgeDesc: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '700',
  },
  earnedMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#32CD32',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
