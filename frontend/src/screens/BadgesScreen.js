import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import ComicPanel, { SoundEffect } from '../components/ComicPanel';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

export default function BadgesScreen({ navigation }) {
  const { BADGES, badgesEarned, xp, level, streak, totalCompleted } = useApp();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
    backgroundColor: COLORS.background,
    ...Platform.select({ web: { minHeight: '100vh' } }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: 56,
    backgroundColor: COLORS.background,
    ...Platform.select({ web: { minHeight: '100%' } }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderBottomWidth: BORDERS.default,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backBtn: {
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  backText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.small,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading5,
    fontWeight: TYPOGRAPHY.weightBlack,
  },
  statLabel: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBold,
    letterSpacing: 1,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: BORDERS.default,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  levelLabel: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBold,
    fontSize: TYPOGRAPHY.small,
    marginRight: SPACING.sm,
  },
  levelValue: {
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.heading5,
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  badgeIconText: {
    fontSize: TYPOGRAPHY.heading4,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  badgeDesc: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.small,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  earnedMark: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.secondary,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  earnedText: {
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBlack,
    fontSize: TYPOGRAPHY.label,
  },
});
