// DayDetailScreen - Full day view with all events

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import {
  selectHolidaysByDate,
  selectNotesByDate,
  selectRemindersByDate,
} from '@/slices';
import { Button, Card, EmptyState } from '@/components/common';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatFullDate } from '@/utils/dateHelpers';

type RouteProps = RootStackScreenProps<'DayDetail'>['route'];
type NavigationProp = RootStackScreenProps<'DayDetail'>['navigation'];

const DayDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const { date } = route.params;

  const holidays = useAppSelector((state) => selectHolidaysByDate(state, date));
  const notes = useAppSelector((state) => selectNotesByDate(state, date));
  const reminders = useAppSelector((state) => selectRemindersByDate(state, date));

  const hasEvents = holidays.length > 0 || notes.length > 0 || reminders.length > 0;

  const handleAddNote = useCallback(() => {
    navigation.navigate('NoteForm', { date });
  }, [navigation, date]);

  const handleAddReminder = useCallback(() => {
    navigation.navigate('ReminderForm', { date });
  }, [navigation, date]);

  const handleNotePress = useCallback(
    (noteId: string) => {
      navigation.navigate('NoteDetail', { noteId });
    },
    [navigation]
  );

  const handleReminderPress = useCallback(
    (reminderId: string) => {
      navigation.navigate('ReminderDetail', { reminderId });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatFullDate(new Date(date))}
        </Text>
        <View style={styles.actions}>
          <Button
            title="Add Note"
            onPress={handleAddNote}
            variant="outline"
            size="sm"
            leftIcon={<Ionicons name="add" size={16} color={colors.primary} />}
          />
          <Button
            title="Add Reminder"
            onPress={handleAddReminder}
            variant="outline"
            size="sm"
            leftIcon={<Ionicons name="add" size={16} color={colors.primary} />}
          />
        </View>
      </View>

      {!hasEvents ? (
        <EmptyState
          icon="calendar-outline"
          title="No events"
          description="Add a note or reminder for this day"
        />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Holidays */}
          {holidays.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Holidays
              </Text>
              {holidays.map((holiday) => (
                <Card key={holiday.id} style={styles.eventCard} variant="outlined">
                  <View style={[styles.indicator, { backgroundColor: colors.holiday }]} />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>
                      {holiday.name}
                    </Text>
                    {holiday.description && (
                      <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                        {holiday.description}
                      </Text>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Notes
              </Text>
              {notes.map((note) => (
                <Card
                  key={note.id}
                  style={styles.eventCard}
                  variant="outlined"
                  onPress={() => handleNotePress(note.id)}
                >
                  <View style={[styles.indicator, { backgroundColor: note.color || colors.note }]} />
                  <View style={styles.eventContent}>
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
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Card>
              ))}
            </View>
          )}

          {/* Reminders */}
          {reminders.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Reminders
              </Text>
              {reminders.map((reminder) => (
                <Card
                  key={reminder.id}
                  style={styles.eventCard}
                  variant="outlined"
                  onPress={() => handleReminderPress(reminder.id)}
                >
                  <View style={[styles.indicator, { backgroundColor: colors.reminder }]} />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>
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
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
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
});

export default DayDetailScreen;
