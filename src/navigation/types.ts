// Navigation type definitions

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Root stack param list
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  NoteDetail: { noteId: string };
  NoteForm: { noteId?: string; date?: string };
  ReminderDetail: { reminderId: string };
  ReminderForm: { reminderId?: string; date?: string };
  DayDetail: { date: string };
};

// Main bottom tab param list
export type MainTabParamList = {
  Calendar: undefined;
  Holidays: undefined;
  NotesReminders: undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Navigation ref for use outside of React components
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
