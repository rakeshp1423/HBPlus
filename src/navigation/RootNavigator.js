import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();


const linking = {
  prefixes: ['hbplus://'],
  config: { screens: { Login: 'login', Dashboard: 'dashboard' } },
};

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) return <Loader label="Checking your session…" />;

  return (
    <NavigationContainer linking={linking} fallback={<Loader />} documentTitle={{ formatter: () => 'HB Plus' }}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
