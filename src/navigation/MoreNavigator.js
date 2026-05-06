import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreMenuScreen from '../screens/MoreMenuScreen';
import ReportsScreen from '../screens/ReportsScreen';
import UsersScreen from '../screens/UsersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const MoreNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.card },
      headerTintColor: colors.foreground,
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <Stack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'More' }} />
    <Stack.Screen name="Reports" component={ReportsScreen} />
    <Stack.Screen name="Users" component={UsersScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default MoreNavigator;
