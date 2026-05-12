import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import BadgesScreen from './src/screens/BadgesScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import IntroScreen from './src/screens/IntroScreen';
import SetupWorkoutScreen from './src/screens/SetupWorkoutScreen';
import { getProfile, getWorkoutPlan } from './src/utils/auth';
import { hydrateProgress } from './src/utils/storage';
import { COLORS } from './src/theme/neoBrutalism';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        <Stack.Screen name="Badges" component={BadgesScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [authScreen, setAuthScreen] = useState('login');
  const [showIntro, setShowIntro] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [customPlan, setCustomPlan] = useState(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const profile = await getProfile();
        if (profile?.progress) {
          await hydrateProgress(profile.progress);
          const plan = await getWorkoutPlan();
          setCustomPlan(plan);
          setSession(profile);
        }
      } catch {
        setSession(null);
      } finally {
        setBooting(false);
      }
    }

    bootstrap();
  }, []);

  if (booting) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  if (!session) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegistered={async (nextSession) => {
            if (nextSession?.progress) {
              await hydrateProgress(nextSession.progress);
            }
            setSession(nextSession);
            setShowIntro(true);
          }}
        />
      );
    }

    return (
      <LoginScreen
        onLoggedIn={async (nextSession) => {
          if (nextSession?.progress) {
            await hydrateProgress(nextSession.progress);
          }
          const plan = await getWorkoutPlan();
          setCustomPlan(plan);
          setSession(nextSession);
        }}
        onSwitchToRegister={() => setAuthScreen('register')}
      />
    );
  }

  if (showIntro) {
    return (
      <IntroScreen
        onContinue={() => {
          setShowIntro(false);
          setShowSetup(true);
        }}
      />
    );
  }

  if (showSetup) {
    return (
      <SetupWorkoutScreen
        onComplete={(plan) => {
          setCustomPlan(plan);
          setShowSetup(false);
        }}
      />
    );
  }

  return (
    <AppProvider session={session} setSession={setSession} customPlan={customPlan}>
      <AppNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
