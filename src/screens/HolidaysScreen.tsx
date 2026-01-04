// HolidaysScreen - Display holidays grouped by month

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView,
} from 'react-native';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchHolidays,
  selectHolidaysGroupedByMonth,
  selectHolidaysLoading,
  selectHolidaysError,
} from '@/slices';
import { Card, LoadingSpinner, EmptyState } from '@/components/common';
import { getCurrentYear, formatDate } from '@/utils/dateHelpers';
import type { Holiday } from '@/types';

interface SectionData {
  title: string;
  data: Holiday[];
}

const HolidaysScreen: React.FC = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();

  const holidaysByMonth = useAppSelector(selectHolidaysGroupedByMonth);
  const isLoading = useAppSelector(selectHolidaysLoading);
  const error = useAppSelector(selectHolidaysError);

  useEffect(() => {
    dispatch(fetchHolidays({ year: getCurrentYear() }));
  }, [dispatch]);

  // Convert to section list format
  const sections: SectionData[] = Object.entries(holidaysByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, holidays]) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      return {
        title: monthName,
        data: holidays,
      };
    });

  const getHolidayTypeBadgeColor = (type: Holiday['type']): string => {
    switch (type) {
      case 'national':
        return colors.holiday;
      case 'regional':
        return colors.accent;
      case 'observance':
        return colors.textSecondary;
      default:
        return colors.textMuted;
    }
  };

  const renderHoliday = ({ item }: { item: Holiday }) => (
    <Card style={styles.holidayCard} variant="outlined">
      <View style={styles.holidayHeader}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dayNumber, { color: colors.primary }]}>
            {new Date(item.date).getDate()}
          </Text>
          <Text style={[styles.dayName, { color: colors.textSecondary }]}>
            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </Text>
        </View>
        <View style={styles.holidayInfo}>
          <Text style={[styles.holidayName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getHolidayTypeBadgeColor(item.type) + '20' },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                { color: getHolidayTypeBadgeColor(item.type) },
              ]}
            >
              {item.type}
            </Text>
          </View>
        </View>
      </View>
      {item.description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      )}
    </Card>
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {section.title}
      </Text>
      <View style={[styles.sectionBadge, { backgroundColor: colors.primary + '20' }]}>
        <Text style={[styles.sectionCount, { color: colors.primary }]}>
          {section.data.length}
        </Text>
      </View>
    </View>
  );

  if (isLoading && sections.length === 0) {
    return <LoadingSpinner fullScreen message="Loading holidays..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Failed to load holidays"
        description={error}
        actionTitle="Retry"
        onAction={() => dispatch(fetchHolidays({ year: getCurrentYear() }))}
      />
    );
  }

  if (sections.length === 0) {
    return (
      <EmptyState
        icon="calendar-outline"
        title="No holidays found"
        description="No holidays are available for this year."
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderHoliday}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  holidayCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
  },
  holidayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 12,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginLeft: 60,
  },
});

export default HolidaysScreen;
