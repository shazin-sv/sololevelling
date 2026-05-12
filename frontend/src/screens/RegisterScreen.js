import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { register } from '../utils/auth';
import { COLORS, TYPOGRAPHY, SHADOWS, BORDERS, SPACING } from '../theme/neoBrutalism';

export default function RegisterScreen({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      if (!username.trim() || !password) {
        throw new Error('Username and password are required');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const session = await register(username.trim(), password);
      onRegistered?.(session);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.kicker}>SOLO LEVELING GYM SYSTEM</Text>
        <Text style={styles.title}>CREATE ACCOUNT</Text>
        <Text style={styles.subtitle}>Join the ranks. Your legend starts now.</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.button}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    ...Platform.select({ web: { minHeight: '100vh' } }),
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  kicker: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.heading2,
    fontWeight: TYPOGRAPHY.weightBlack,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    fontSize: TYPOGRAPHY.body,
    marginBottom: SPACING.md,
    color: COLORS.foreground,
    fontWeight: TYPOGRAPHY.weightBold,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderWidth: BORDERS.default,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.medium,
  },
  buttonText: {
    color: COLORS.foreground,
    fontSize: TYPOGRAPHY.label,
    fontWeight: TYPOGRAPHY.weightBlack,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  error: {
    color: COLORS.error,
    marginTop: SPACING.md,
    fontWeight: TYPOGRAPHY.weightBlack,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.bodySmall,
  },
});
