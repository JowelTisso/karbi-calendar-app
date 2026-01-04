// ReminderFormScreen - Create or edit a reminder

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectReminderById, createReminder, updateReminder } from '@/slices';
import { useNotifications } from '@/hooks/useNotifications';
import { Button, Input, Card } from '@/components/common';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatDate, formatTime } from '@/utils/dateHelpers';

type RouteProps = RootStackScreenProps<'ReminderForm'>['route'];
type NavigationProp = RootStackScreenProps<'ReminderForm'>['navigation'];

const ReminderFormScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  // const { isEnabled: notificationsEnabled, requestPermission } = useNotifications();

  const { reminderId, date } = route.params || {};
  const existingReminder = useAppSelector((state) =>
    reminderId ? selectReminderById(state, reminderId) : undefined
  );

  const getInitialDateTime = () => {
    if (existingReminder) {
      return new Date(existingReminder.reminderTime);
    }
    if (date) {
      const d = new Date(date);
      d.setHours(9, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d;
  };

  const [title, setTitle] = useState(existingReminder?.title || '');
  const [description, setDescription] = useState(existingReminder?.description || '');
  const [reminderDateTime, setReminderDateTime] = useState(getInitialDateTime());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    navigation.setOptions({
      title: existingReminder ? 'Edit Reminder' : 'New Reminder',
    });
  }, [navigation, existingReminder]);

  // useEffect(() => {
  //   if (!notificationsEnabled) {
  //     requestPermission();
  //   }
  // }, [notificationsEnabled, requestPermission]);

  const validate = (): boolean => {
    const newErrors: { title?: string; time?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (reminderDateTime <= new Date()) {
      newErrors.time = 'Reminder time must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDateTime = new Date(reminderDateTime);
      newDateTime.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setReminderDateTime(newDateTime);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDateTime = new Date(reminderDateTime);
      newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setReminderDateTime(newDateTime);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (existingReminder) {
        await dispatch(
          updateReminder({
            id: existingReminder.id,
            title: title.trim(),
            description: description.trim() || undefined,
            reminderTime: reminderDateTime.toISOString(),
          })
        ).unwrap();
      } else {
        await dispatch(
          createReminder({
            title: title.trim(),
            description: description.trim() || undefined,
            reminderTime: reminderDateTime.toISOString(),
          })
        ).unwrap();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, navigation, existingReminder, title, description, reminderDateTime]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* {!notificationsEnabled && (
          <Card style={[styles.warningCard, { backgroundColor: colors.warning + '20' }]}>
            <Text style={[styles.warningText, { color: colors.warning }]}>
              Notifications are disabled. Enable them to receive reminder alerts.
            </Text>
            <Button
              title="Enable"
              onPress={requestPermission}
              variant="outline"
              size="sm"
            />
          </Card>
        )} */}

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter reminder title"
          error={errors.title}
          autoFocus={!existingReminder}
        />

        <Input
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details..."
          multiline
          numberOfLines={4}
        />

        <View style={styles.dateTimeSection}>
          <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateTimeLabel, { color: colors.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.dateTimeValue, { color: colors.text }]}>
                {formatDate(reminderDateTime)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateTimeLabel, { color: colors.textSecondary }]}>
                Time
              </Text>
              <Text style={[styles.dateTimeValue, { color: colors.text }]}>
                {formatTime(reminderDateTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {errors.time && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.time}
            </Text>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={reminderDateTime}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={reminderDateTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>

      <View style={[styles.actions, { backgroundColor: colors.surface }]}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.actionButton}
        />
        <Button
          title={existingReminder ? 'Save Changes' : 'Create Reminder'}
          onPress={handleSubmit}
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  dateTimeSection: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  dateTimeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default ReminderFormScreen;
