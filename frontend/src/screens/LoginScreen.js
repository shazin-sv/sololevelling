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
import { login } from '../utils/auth';

export default function LoginScreen({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const session = await login(username.trim(), password);
      onLoggedIn?.(session);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        <Text style={styles.kicker}>SOLO LEVELING GYM SYSTEM</Text>
        <Text style={styles.title}>SIGN IN</Text>
        <Text style={styles.subtitle}>Your account now saves progress to Neon.</Text>

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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.button}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>ENTER SYSTEM</Text>}
        </TouchableOpacity>

        <View style={styles.hintBox}>
          <Text style={styles.hintLabel}>SEEDED ACCOUNT</Text>
          <Text style={styles.hintText}>Please Contact Admin</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    ...Platform.select({ web: { minHeight: '100vh' } }),
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    padding: 22,
  },
  kicker: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#020617',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  error: {
    color: '#F87171',
    marginBottom: 8,
    fontWeight: '700',
  },
  hintBox: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  hintLabel: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  hintText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
});
