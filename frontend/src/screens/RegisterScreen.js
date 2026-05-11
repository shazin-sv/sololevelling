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
      <StatusBar barStyle="light-content" />
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
    width: '100%',
    maxWidth: 400,
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
});
