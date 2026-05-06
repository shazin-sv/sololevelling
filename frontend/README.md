# HeroFit

A gamified comic-book style fitness app built with React Native + Expo.

## Features

- **Weekly Workout Schedule**: 6 exercises per day, structured split (Chest/Tri, Back/Bi, Shoulders/Tri, Back Thickness, Legs Light, Legs Heavy, Rest)
- **Exercise Detail**: Embedded YouTube tutorial search, target muscles, step-by-step instructions
- **Gamification**: XP, streaks, levels (Rookie → Legend), and unlockable badges
- **Comic Book UI**: Thick black outlines, bold typography, tilted panels, explosion effects, speech bubbles
- **Rest Timer**: Built-in 30–90 second timer between sets
- **Exercise Swap**: Replace exercises with predefined alternatives
- **Local Persistence**: All progress saved with AsyncStorage

## Tech Stack

- React Native (Expo)
- React Navigation (Native Stack)
- AsyncStorage
- react-native-webview (YouTube embed)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`) or use npx

### Installation

```bash
cd HeroFit
npm install
```

### Running the app

```bash
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR with Expo Go on your phone

## Assets

Add the following images to the `assets/` folder before building:

- `icon.png` (1024×1024)
- `splash.png` (1242×2436 or similar)
- `adaptive-icon.png` (1024×1024)
- `favicon.png` (512×512)

## Project Structure

```
HeroFit/
├── App.js
├── src/
│   ├── components/
│   │   ├── ComicPanel.js
│   │   ├── ExplosionEffect.js
│   │   ├── ProgressRing.js
│   │   ├── RestTimer.js
│   │   └── StreakFlame.js
│   ├── context/
│   │   └── AppContext.js
│   ├── data/
│   │   └── workouts.js
│   ├── screens/
│   │   ├── BadgesScreen.js
│   │   ├── ExerciseDetailScreen.js
│   │   ├── HomeScreen.js
│   │   ├── WebViewScreen.js
│   │   └── WorkoutScreen.js
│   └── utils/
│       └── storage.js
└── package.json
```

## License

MIT
