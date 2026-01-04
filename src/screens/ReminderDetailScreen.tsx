// ReminderDetailScreen - View and manage a single reminder

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectReminderById, deleteReminder, completeReminder } from '@/slices';
import { Button, Card } from '@/components/common';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatFullDate, formatTime } from '@/utils/dateHelpers';

type RouteProps = RootStackScreenProps<'ReminderDetail'>['route'];
type NavigationProp = RootStackScreenProps<'ReminderDetail'>['navigation'];

const ReminderDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const { reminderId } = route.params;

  const reminder = useAppSelector((state) => selectReminderById(state, reminderId));

  const handleEdit = useCallback(() => {
    navigation.navigate('ReminderForm', { reminderId });
  }, [navigation, reminderId]);

  const handleComplete = useCallback(async () => {
    await dispatch(completeReminder(reminderId));
  }, [dispatch, reminderId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteReminder(reminderId));
            navigation.goBack();
          },
        },
      ]
    );
  }, [dispatch, navigation, reminderId]);

  if (!reminder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            Reminder not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const reminderDate = new Date(reminder.reminderTime);
  const isCompleted = reminder.status === 'completed';
  const isPast = reminderDate < new Date() && !isCompleted;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isCompleted
                    ? colors.success + '20'
                    : isPast
                    ? colors.error + '20'
                    : colors.reminder + '20',
                },
              ]}
            >
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : isPast ? 'alert-circle' : 'alarm'}
                size={18}
                color={isCompleted ? colors.success : isPast ? colors.error : colors.reminder}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isCompleted
                      ? colors.success
                      : isPast
                      ? colors.error
                      : colors.reminder,
                  },
                ]}
              >
                {isCompleted ? 'Completed' : isPast ? 'Overdue' : 'Active'}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.text },
              isCompleted && styles.completedTitle,
            ]}
          >
            {reminder.title}
          </Text>

          {reminder.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {reminder.description}
            </Text>
          )}

          <View style={[styles.timeSection, { backgroundColor: colors.background }]}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <View style={styles.timeInfo}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                Reminder Time
              </Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {formatFullDate(reminderDate)} at {formatTime(reminderDate)}
              </Text>
            </View>
          </View>

          {reminder.completedAt && (
            <View style={styles.completedInfo}>
              <Ionicons name="checkmark-done" size={20} color={colors.success} />
              <Text style={[styles.completedText, { color: colors.textSecondary }]}>
                Completed on {new Date(reminder.completedAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={[styles.meta, { borderTopColor: colors.border }]}>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              Created: {new Date(reminder.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.actions, { backgroundColor: colors.surface }]}>
        {!isCompleted && (
          <Button
            title="Complete"
            onPress={handleComplete}
            variant="secondary"
            style={styles.actionButton}
            leftIcon={<Ionicons name="checkmark" size={20} color="#FFFFFF" />}
          />
        )}
        <Button
          title="Edit"
          onPress={handleEdit}
          variant="primary"
          style={styles.actionButton}
          leftIcon={<Ionicons name="create-outline" size={20} color="#FFFFFF" />}
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="danger"
          style={styles.actionButton}
          leftIcon={<Ionicons name="trash-outline" size={20} color="#FFFFFF" />}
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
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  completedText: {
    fontSize: 14,
  },
  meta: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaText: {
    fontSize: 12,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
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

export default ReminderDetailScreen;
