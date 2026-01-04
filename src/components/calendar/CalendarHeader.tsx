// CalendarHeader component - Month navigation and today button

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { formatMonthYear, parseMonthKey } from '@/utils/dateHelpers';

interface CalendarHeaderProps {
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const colors = useThemeColors();
  const { year, month } = parseMonthKey(currentMonth);
  const displayDate = new Date(year, month - 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={[styles.navButton, { backgroundColor: colors.background }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onToday} activeOpacity={0.7}>
          <Text style={[styles.monthText, { color: colors.text }]}>
            {formatMonthYear(displayDate)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextMonth}
          style={[styles.navButton, { backgroundColor: colors.background }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onToday}
        style={[styles.todayButton, { borderColor: colors.primary }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.todayText, { color: colors.primary }]}>Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 140,
    textAlign: 'center',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  todayText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CalendarHeader;
