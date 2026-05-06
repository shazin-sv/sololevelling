import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen({ route, navigation }) {
  const { uri } = route.params || {};

  useEffect(() => {
    if (Platform.OS === 'web' && uri) {
      Linking.openURL(uri);
    }
  }, [uri]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← CLOSE</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'web' ? (
        <View style={styles.webFallback}>
          <Text style={styles.fallbackTitle}>OPENED IN A NEW TAB</Text>
          <Text style={styles.fallbackText}>
            If the browser blocked the popup, use the button below.
          </Text>
          <TouchableOpacity onPress={() => uri && Linking.openURL(uri)} style={styles.openBtn}>
            <Text style={styles.openBtnText}>OPEN LINK</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView source={{ uri }} style={styles.webview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
  },
  backBtn: {
    borderWidth: 2,
    borderColor: '#555555',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  webview: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 8,
  },
  fallbackText: {
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  openBtn: {
    borderWidth: 2,
    borderColor: '#60A5FA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
  },
  openBtnText: {
    color: '#60A5FA',
    fontWeight: '900',
    letterSpacing: 1,
  },
});
