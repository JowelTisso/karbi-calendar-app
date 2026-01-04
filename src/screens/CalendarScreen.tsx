// CalendarScreen - Main calendar view with events

import React, { useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors, useCalendarTheme } from '@/hooks/useTheme';
import { useCalendarData } from '@/hooks/useCalendarData';
import { CalendarHeader, EventList } from '@/components/calendar';
import { LoadingSpinner } from '@/components/common';
import type { MainTabScreenProps } from '@/navigation/types';
import { formatFullDate } from '@/utils/dateHelpers';

type NavigationProp = MainTabScreenProps<'Calendar'>['navigation'];

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const calendarTheme = useCalendarTheme();

  const {
    selectedDate,
    currentMonth,
    isLoading,
    markedDates,
    selectedDateEvents,
    selectDate,
    nextMonth,
    prevMonth,
    jumpToToday,
  } = useCalendarData();

  const handleDayPress = useCallback(
    (day: { dateString: string }) => {
      selectDate(day.dateString);
    },
    [selectDate]
  );

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
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={jumpToToday}
      />

      <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
        <Calendar
          current={`${currentMonth}-01`}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={calendarTheme}
          hideExtraDays={false}
          enableSwipeMonths={true}
          onMonthChange={(month) => {
            // Month changes are handled by swipe
          }}
          markingType="multi-dot"
          style={styles.calendar}
        />
      </View>

      <View style={styles.eventsSection}>
        <View style={[styles.selectedDateHeader, { borderColor: colors.border }]}>
          <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
            <View
              style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}
            />
          </View>
          <View style={styles.dateInfo}>
            <View style={styles.dateTextContainer}>
              <View
                style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}
              />
              {/* Using a simpler approach for the header */}
            </View>
          </View>
        </View>

        {isLoading ? (
          <LoadingSpinner size="small" message="Loading events..." />
        ) : (
          <EventList
            holidays={selectedDateEvents.holidays}
            notes={selectedDateEvents.notes}
            reminders={selectedDateEvents.reminders}
            onNotePress={handleNotePress}
            onReminderPress={handleReminderPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 16,
  },
  eventsSection: {
    flex: 1,
    marginTop: 16,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  dateBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
});

export default CalendarScreen;
