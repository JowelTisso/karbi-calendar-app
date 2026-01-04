// DayCell component - Custom day rendering for calendar

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useTheme';
import { useDateMarkers } from '@/hooks/useCalendarData';
import { isToday } from '@/utils/dateHelpers';

interface DayCellProps {
  date: string;
  day: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  onPress: (date: string) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  day,
  isSelected,
  isCurrentMonth,
  onPress,
}) => {
  const colors = useThemeColors();
  const { dots, hasAnyEvent } = useDateMarkers(date);
  const isTodayDate = isToday(new Date(date));

  const getTextColor = (): string => {
    if (!isCurrentMonth) return colors.dayTextDisabled;
    if (isSelected) return '#FFFFFF';
    if (isTodayDate) return colors.primary;
    return colors.dayText;
  };

  const getBackgroundColor = (): string => {
    if (isSelected) return colors.selected;
    if (isTodayDate) return colors.today;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={styles.container}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.dayContainer,
          {
            backgroundColor: getBackgroundColor(),
          },
          isTodayDate && !isSelected && styles.todayBorder,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: getTextColor() },
            isSelected && styles.selectedText,
          ]}
        >
          {day}
        </Text>
      </View>

      {/* Event dots */}
      {hasAnyEvent && (
        <View style={styles.dotsContainer}>
          {dots.slice(0, 3).map((dot, index) => (
            <View
              key={dot.key}
              style={[
                styles.dot,
                { backgroundColor: dot.color },
                index > 0 && styles.dotSpacing,
              ]}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayBorder: {
    borderWidth: 1,
    borderColor: 'currentColor',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 2,
    height: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotSpacing: {
    marginLeft: 2,
  },
});

export default DayCell;
