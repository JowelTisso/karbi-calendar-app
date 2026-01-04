// Main App component with Redux Provider and Navigation

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

import { store, loadPersistedState } from '@/store';
import { setNotes, setReminders, setHolidays } from '@/slices';
import { RootNavigator } from '@/navigation';
import { useNavigationTheme, useIsDarkMode } from '@/hooks/useTheme';
import { LoadingSpinner } from '@/components/common';

import './global.css';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// App content with hooks access
const AppContent: React.FC = () => {
  const navigationTheme = useNavigationTheme();
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

// Main App with Redux Provider
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load persisted state from AsyncStorage
        const persistedState = await loadPersistedState();

        // Hydrate Redux store with persisted data
        if (persistedState.notes) {
          store.dispatch(setNotes(persistedState.notes));
        }
        if (persistedState.reminders) {
          store.dispatch(setReminders(persistedState.reminders));
        }
        if (persistedState.holidays) {
          store.dispatch(setHolidays(persistedState.holidays));
        }

        // Artificial delay for smooth splash screen transition
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Failed to load persisted state:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner fullScreen message="Loading..." />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
