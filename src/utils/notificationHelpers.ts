// Expo Notifications helper functions

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNEL_ID } from './constants';
import type { Reminder, ReminderNotificationData } from '@/types';

// Configure notification handler (how notifications appear when app is foregrounded)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,   
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return 'granted';
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return 'denied';
  }
};

// Get current notification permission status
export const getNotificationPermissionStatus = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting notification permission status:', error);
    return 'undetermined';
  }
};

// Create notification channel for Android
export const createNotificationChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });
  } catch (error) {
    console.error('Error creating notification channel:', error);
  }
};

// Schedule a notification for a reminder
export const scheduleReminderNotification = async (
  reminder: Reminder
): Promise<string | null> => {
  try {
    const reminderDate = new Date(reminder.reminderTime);
    const now = new Date();

    // Don't schedule if reminder time is in the past
    if (reminderDate <= now) {
      console.warn('Cannot schedule notification for past time');
      return null;
    }

    const notificationData = {
      reminderId: reminder.id,
      type: 'reminder',
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description,
        data: notificationData,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        ...(Platform.OS === 'android' && {
          channelId: NOTIFICATION_CHANNEL_ID,
        }),
      },
      trigger: {
        date: reminderDate,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a scheduled notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Update a reminder's notification (cancel old, schedule new)
export const updateReminderNotification = async (
  oldNotificationId: string | undefined,
  reminder: Reminder
): Promise<string | null> => {
  // Cancel old notification if exists
  if (oldNotificationId) {
    await cancelNotification(oldNotificationId);
  }

  // Schedule new notification if reminder is active and in future
  if (reminder.status === 'active') {
    return await scheduleReminderNotification(reminder);
  }

  return null;
};

// Dismiss all presented notifications
export const dismissAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Error dismissing notifications:', error);
  }
};

// Get badge count (iOS)
export const getBadgeCount = async (): Promise<number> => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

// Set badge count (iOS)
export const setBadgeCount = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

// Check if notification ID is still scheduled
export const isNotificationScheduled = async (notificationId: string): Promise<boolean> => {
  try {
    const scheduled = await getScheduledNotifications();
    return scheduled.some(n => n.identifier === notificationId);
  } catch (error) {
    console.error('Error checking notification status:', error);
    return false;
  }
};

// Reschedule all active reminders (useful after app reinstall)
export const rescheduleActiveReminders = async (
  reminders: Reminder[]
): Promise<Map<string, string>> => {
  const results = new Map<string, string>();

  for (const reminder of reminders) {
    if (reminder.status !== 'active') continue;

    const reminderDate = new Date(reminder.reminderTime);
    if (reminderDate <= new Date()) continue;

    // Cancel existing notification if any
    if (reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }

    // Schedule new notification
    const newNotificationId = await scheduleReminderNotification(reminder);
    if (newNotificationId) {
      results.set(reminder.id, newNotificationId);
    }
  }

  return results;
};

// Initialize notifications (call on app start)
export const initializeNotifications = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
  // Create Android channel
  await createNotificationChannel();

  // Request permissions
  const status = await requestNotificationPermissions();

  return status;
};
