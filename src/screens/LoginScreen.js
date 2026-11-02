import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import ErrorBanner from '../components/ErrorBanner';
import { ALLOWED_DOMAIN } from '../config/env';
import { colors, radius } from '../theme';

export default function LoginScreen() {
  const { signInWithGoogle, signingIn, error, clearError } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.logo}><Text style={styles.logoText}>HB</Text></View>
        <Text style={styles.title}>Sign in to HB Plus</Text>
        <Text style={styles.subtitle}>
          Use your @{ALLOWED_DOMAIN} Google account to continue.
        </Text>

        <View style={styles.gap} />
        <ErrorBanner message={error} onDismiss={clearError} />
        {error ? <View style={styles.gap} /> : null}

        <GoogleButton onPress={signInWithGoogle} loading={signingIn} />

        <Text style={styles.foot}>Access is limited to @{ALLOWED_DOMAIN} accounts.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    width: '100%', maxWidth: 420, backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.line, padding: 28, alignItems: 'center',
  },
  logo: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 20, letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: 'center' },
  gap: { height: 20, width: '100%' },
  foot: { marginTop: 20, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
