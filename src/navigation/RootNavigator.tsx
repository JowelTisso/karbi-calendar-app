// Root navigator - Stack navigator with bottom tabs and modal screens

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useThemeColors } from '@/hooks/useTheme';

// Navigators
import BottomTabNavigator from './BottomTabNavigator';

// Modal screens (will be created later)
import NoteDetailScreen from '@/screens/NoteDetailScreen';
import NoteFormScreen from '@/screens/NoteFormScreen';
import ReminderDetailScreen from '@/screens/ReminderDetailScreen';
import ReminderFormScreen from '@/screens/ReminderFormScreen';
import DayDetailScreen from '@/screens/DayDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      id='stack-navigator'
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={({ route }) => ({
          title: route.params.date,
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={{
          title: 'Note',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="NoteForm"
        component={NoteFormScreen}
        options={({ route }) => ({
          title: route.params?.noteId ? 'Edit Note' : 'New Note',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name="ReminderDetail"
        component={ReminderDetailScreen}
        options={{
          title: 'Reminder',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="ReminderForm"
        component={ReminderFormScreen}
        options={({ route }) => ({
          title: route.params?.reminderId ? 'Edit Reminder' : 'New Reminder',
          presentation: 'modal',
        })}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
