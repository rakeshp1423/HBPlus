import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { fetchAllUsers } from '../services/userService';
import { colors, radius } from '../theme';

function Avatar({ uri, name }) {
  if (uri) return <Image source={{ uri }} style={styles.avatar} />;
  return (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarText}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}

function RoleBadge({ role }) {
  const admin = role === 'admin';
  return (
    <View style={[styles.badge, admin ? styles.badgeAdmin : styles.badgeUser]}>
      <Text style={[styles.badgeText, { color: admin ? colors.primary : colors.success }]}>
        {admin ? 'Admin' : 'User'}
      </Text>
    </View>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchAllUsers().then(setUsers).catch(() => setErr('Could not load users.'));
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>All users</Text>
      {err ? <Text style={styles.err}>{err}</Text> : null}
      {!users && !err ? <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} /> : null}
      {users?.map((u) => (
        <View key={u.id} style={styles.userRow}>
          <Avatar uri={u.photoURL} name={u.displayName || u.email} />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>{u.displayName || '—'}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{u.email}</Text>
          </View>
          <RoleBadge role={u.role} />
        </View>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  const { user, profile, isAdmin, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 768;
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try { await logout(); } finally { setLoggingOut(false); }
  };

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerInner}>
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>HB</Text></View>
            <Text style={styles.brandText}>HB Plus</Text>
          </View>
          <Pressable onPress={onLogout} disabled={loggingOut} accessibilityRole="button" style={({ pressed }) => [styles.logout, pressed && { opacity: 0.7 }]}>
            {loggingOut ? <ActivityIndicator size="small" color={colors.ink} /> : <Text style={styles.logoutText}>Log out</Text>}
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.content}>
          <Text style={styles.h1}>Welcome back, {(user.displayName || 'there').split(' ')[0]}</Text>

          <View style={[styles.grid, wide && styles.gridWide]}>
            <View style={[styles.card, wide && { flex: 1 }]}>
              <View style={styles.profileRow}>
                <Avatar uri={user.photoURL} name={user.displayName || user.email} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName} numberOfLines={1}>{user.displayName || 'Unnamed user'}</Text>
                  <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                </View>
                <RoleBadge role={profile?.role} />
              </View>
            </View>

            <View style={[styles.card, wide && { flex: 1 }]}>
              <Text style={styles.cardTitle}>Your access</Text>
              <Text style={styles.body2}>
                {isAdmin
                  ? 'You have admin access. You can see every user in the workspace below.'
                  : 'You have standard access to this workspace.'}
              </Text>
            </View>
          </View>

          {isAdmin ? <AdminUsers /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 12, paddingHorizontal: 20 },
  headerInner: { width: '100%', maxWidth: 960, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  brandText: { fontSize: 17, fontWeight: '700', color: colors.ink },
  logout: { paddingHorizontal: 16, height: 38, minWidth: 84, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  body: { padding: 20, alignItems: 'center' },
  content: { width: '100%', maxWidth: 960 },
  h1: { fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 20 },
  grid: { gap: 16 },
  gridWide: { flexDirection: 'row' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  body2: { fontSize: 15, lineHeight: 22, color: colors.muted },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { backgroundColor: colors.adminBg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: 17 },
  userName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  userEmail: { fontSize: 13, color: colors.muted, marginTop: 2 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.line },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeAdmin: { backgroundColor: colors.adminBg },
  badgeUser: { backgroundColor: colors.successBg },
  badgeText: { fontSize: 12, fontWeight: '700' },
  err: { color: colors.danger, fontSize: 14 },
});
