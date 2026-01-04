// Bottom tab navigator

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import { useThemeColors } from '@/hooks/useTheme';

// Screens (will be created later)
import CalendarScreen from '@/screens/CalendarScreen';
import HolidaysScreen from '@/screens/HolidaysScreen';
import NotesRemindersScreen from '@/screens/NotesRemindersScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const getTabIcon = (routeName: keyof MainTabParamList, focused: boolean): IconName => {
  const icons: Record<keyof MainTabParamList, { active: IconName; inactive: IconName }> = {
    Calendar: { active: 'calendar', inactive: 'calendar-outline' },
    Holidays: { active: 'gift', inactive: 'gift-outline' },
    NotesReminders: { active: 'document-text', inactive: 'document-text-outline' },
  };

  return focused ? icons[routeName].active : icons[routeName].inactive;
};

const BottomTabNavigator: React.FC = () => {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      id='navigator-bottom-tabs'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Holidays"
        component={HolidaysScreen}
        options={{
          title: 'Holidays',
        }}
      />
      <Tab.Screen
        name="NotesReminders"
        component={NotesRemindersScreen}
        options={{
          title: 'Notes & Reminders',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
