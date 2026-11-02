import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export default function GoogleButton({ onPress, loading, disabled }) {
  const off = loading || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel="Login with Google"
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, off && styles.off]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={styles.row}>
          <View style={styles.g}><Text style={styles.gText}>G</Text></View>
          <Text style={styles.label}>Login with Google</Text>
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: {
    width: '100%', height: 50, borderRadius: radius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  pressed: { backgroundColor: '#F8F9FC' },
  off: { opacity: 0.7 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  g: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1,
    borderColor: colors.line, alignItems: 'center', justifyContent: 'center',
  },
  gText: { color: '#4285F4', fontWeight: '800', fontSize: 14 },
  label: { color: colors.ink, fontSize: 16, fontWeight: '600' },
});
