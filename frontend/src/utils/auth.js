import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SESSION_KEY = 'herofit_session';
const API_PORT = '9001';

function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return null;
  return value.trim().replace(/\/$/, '');
}

function hostToApiUrl(hostValue) {
  if (!hostValue || typeof hostValue !== 'string') return null;

  const cleaned = hostValue
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');

  if (!cleaned) return null;
  return `http://${cleaned}:${API_PORT}`;
}

function getConfiguredBaseUrl() {
  return normalizeBaseUrl(
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_URL || null
  );
}

function getExpoHostBaseUrl() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.platform?.hostUri,
  ];

  for (const candidate of candidates) {
    const derived = hostToApiUrl(candidate);
    if (derived) return derived;
  }

  return null;
}

export function getApiBaseUrl() {
  const configured = getConfiguredBaseUrl();
  if (configured) return configured;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:${API_PORT}`;
  }

  const expoHost = getExpoHostBaseUrl();
  if (expoHost) return expoHost;

  if (Platform.OS === 'android') return `http://10.0.2.2:${API_PORT}`;
  return `http://localhost:${API_PORT}`;
}

async function request(path, options = {}) {
  const baseUrl = getApiBaseUrl();

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(`Failed to fetch from ${baseUrl}. Make sure the API server is running and reachable.`);
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

export async function login(username, password) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(result));
  return result;
}

export async function logout() {
  const session = await getStoredSession();
  if (session?.token) {
    try {
      await request('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
    } catch {
      // ignore
    }
  }
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getStoredSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getProfile() {
  const session = await getStoredSession();
  if (!session?.token) return null;

  const result = await request('/me', {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const merged = {
    ...session,
    user: result.user,
    progress: result.progress,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(merged));
  return merged;
}

export async function saveRemoteProgress(progress) {
  const session = await getStoredSession();
  if (!session?.token) {
    throw new Error('Not authenticated. Cannot save progress.');
  }

  const result = await request('/progress', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ progress }),
  });

  const merged = {
    ...session,
    progress: result.progress,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(merged));
}
