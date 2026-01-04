// useNotifications hook - Notification permissions and management

import { useEffect, useCallback, useRef  } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setNotificationPermission, selectNotificationPermission } from '@/slices';
import { initializeNotifications } from '@/utils/notificationHelpers';

export interface UseNotificationsResult {
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  requestPermission: () => Promise<boolean>;
  isEnabled: boolean;
}

export const useNotifications = (): UseNotificationsResult => {
  const dispatch = useAppDispatch();
  const permissionStatus = useAppSelector(selectNotificationPermission);

  // Initialize notifications on mount
  useEffect(() => {
    const init = async () => {
      try {
        const granted = await initializeNotifications();
        dispatch(setNotificationPermission(granted ? 'granted' : 'denied'));
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
        dispatch(setNotificationPermission('denied'));
      }
    };

    init();
  }, [dispatch]);

  // Check current permission status
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      dispatch(setNotificationPermission(status as 'granted' | 'denied' | 'undetermined'));
    };

    checkPermission();
  }, [dispatch]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B6B',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        dispatch(setNotificationPermission('granted'));
        return true;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      dispatch(setNotificationPermission(granted ? 'granted' : 'denied'));
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      dispatch(setNotificationPermission('denied'));
      return false;
    }
  }, [dispatch]);

  return {
    permissionStatus,
    requestPermission,
    isEnabled: permissionStatus === 'granted',
  };
};

// Hook for listening to notification events
export const useNotificationListener = (
  onReceive?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void
) => {
  const receiveSubscription = useRef<Notifications.Subscription | null>(null);
  const responseSubscription = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (onReceive) {
      receiveSubscription.current =
        Notifications.addNotificationReceivedListener(onReceive);
    }

    if (onResponse) {
      responseSubscription.current =
        Notifications.addNotificationResponseReceivedListener(onResponse);
    }

    return () => {
      receiveSubscription.current?.remove();
      responseSubscription.current?.remove();

      receiveSubscription.current = null;
      responseSubscription.current = null;
    };
  }, [onReceive, onResponse]);
};

export default useNotifications;
