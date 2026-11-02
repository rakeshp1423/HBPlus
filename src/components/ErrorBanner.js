import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={10} accessibilityLabel="Dismiss error">
          <Text style={styles.x}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.dangerBg, borderColor: colors.dangerLine, borderWidth: 1,
    borderRadius: radius.md, padding: 14, width: '100%',
  },
  text: { flex: 1, color: colors.danger, fontSize: 14, lineHeight: 20 },
  x: { color: colors.danger, fontSize: 14 },
});
