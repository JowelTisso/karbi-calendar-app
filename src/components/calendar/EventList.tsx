// EventList component - Display events for selected date

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { Card } from '@/components/common';
import type { Holiday, Note, Reminder } from '@/types';
import { formatTime } from '@/utils/dateHelpers';

interface EventListProps {
  holidays: Holiday[];
  notes: Note[];
  reminders: Reminder[];
  onNotePress?: (noteId: string) => void;
  onReminderPress?: (reminderId: string) => void;
}

const EventList: React.FC<EventListProps> = ({
  holidays,
  notes,
  reminders,
  onNotePress,
  onReminderPress,
}) => {
  const colors = useThemeColors();

  const hasEvents = holidays.length > 0 || notes.length > 0 || reminders.length > 0;

  if (!hasEvents) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No events for this day
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Holidays */}
      {holidays.map((holiday) => (
        <Card key={holiday.id} style={styles.eventCard} variant="outlined">
          <View style={styles.eventHeader}>
            <View style={[styles.indicator, { backgroundColor: colors.holiday }]} />
            <Ionicons name="gift" size={18} color={colors.holiday} />
            <Text style={[styles.eventType, { color: colors.holiday }]}>
              Holiday
            </Text>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {holiday.name}
          </Text>
          {holiday.description && (
            <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
              {holiday.description}
            </Text>
          )}
        </Card>
      ))}

      {/* Notes */}
      {notes.map((note) => (
        <Card
          key={note.id}
          style={styles.eventCard}
          variant="outlined"
          onPress={() => onNotePress?.(note.id)}
        >
          <View style={styles.eventHeader}>
            <View style={[styles.indicator, { backgroundColor: colors.note }]} />
            <Ionicons name="document-text" size={18} color={colors.note} />
            <Text style={[styles.eventType, { color: colors.note }]}>Note</Text>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {note.title}
          </Text>
          {note.content && (
            <Text
              style={[styles.eventDescription, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {note.content}
            </Text>
          )}
        </Card>
      ))}

      {/* Reminders */}
      {reminders.map((reminder) => (
        <Card
          key={reminder.id}
          style={styles.eventCard}
          variant="outlined"
          onPress={() => onReminderPress?.(reminder.id)}
        >
          <View style={styles.eventHeader}>
            <View style={[styles.indicator, { backgroundColor: colors.reminder }]} />
            <Ionicons name="alarm" size={18} color={colors.reminder} />
            <Text style={[styles.eventType, { color: colors.reminder }]}>
              Reminder
            </Text>
            <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
              {formatTime(new Date(reminder.reminderTime))}
            </Text>
          </View>
          <Text
            style={[
              styles.eventTitle,
              { color: colors.text },
              reminder.status === 'completed' && styles.completedText,
            ]}
          >
            {reminder.title}
          </Text>
          {reminder.description && (
            <Text
              style={[styles.eventDescription, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {reminder.description}
            </Text>
          )}
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
  eventCard: {
    marginBottom: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  indicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 4,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  eventTime: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});

export default EventList;
