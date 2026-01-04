// NotesRemindersScreen - Display notes and reminders with tabs

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import {
  selectAllNotes,
  selectActiveReminders,
} from '@/slices';
import { Card, EmptyState } from '@/components/common';
import type { MainTabScreenProps } from '@/navigation/types';
import type { Note, Reminder } from '@/types';
import { formatDate, formatTime } from '@/utils/dateHelpers';

type NavigationProp = MainTabScreenProps<'NotesReminders'>['navigation'];
type TabType = 'notes' | 'reminders';

const NotesRemindersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  const notes = useAppSelector(selectAllNotes);
  const reminders = useAppSelector(selectActiveReminders);

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

  const handleAddNote = useCallback(() => {
    navigation.navigate('NoteForm', {});
  }, [navigation]);

  const handleAddReminder = useCallback(() => {
    navigation.navigate('ReminderForm', {});
  }, [navigation]);

  const renderNote = ({ item }: { item: Note }) => (
    <Card
      style={styles.itemCard}
      variant="outlined"
      onPress={() => handleNotePress(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.colorDot, { backgroundColor: item.color || colors.note }]} />
        <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
          {formatDate(new Date(item.date))}
        </Text>
      </View>
      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
      {item.content && (
        <Text
          style={[styles.itemContent, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
      )}
    </Card>
  );

  const renderReminder = ({ item }: { item: Reminder }) => (
    <Card
      style={styles.itemCard}
      variant="outlined"
      onPress={() => handleReminderPress(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.colorDot, { backgroundColor: colors.reminder }]} />
        <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
          {formatDate(new Date(item.reminderTime))} at{' '}
          {formatTime(new Date(item.reminderTime))}
        </Text>
      </View>
      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
      {item.description && (
        <Text
          style={[styles.itemContent, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      )}
    </Card>
  );

  const renderEmptyNotes = () => (
    <EmptyState
      icon="document-text-outline"
      title="No notes yet"
      description="Create your first note to get started"
      actionTitle="Add Note"
      onAction={handleAddNote}
    />
  );

  const renderEmptyReminders = () => (
    <EmptyState
      icon="alarm-outline"
      title="No reminders"
      description="Create a reminder to never forget important tasks"
      actionTitle="Add Reminder"
      onAction={handleAddReminder}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notes' && { backgroundColor: colors.primary + '20' },
          ]}
          onPress={() => setActiveTab('notes')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="document-text"
            size={20}
            color={activeTab === 'notes' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'notes' ? colors.primary : colors.textSecondary },
            ]}
          >
            Notes ({notes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'reminders' && { backgroundColor: colors.primary + '20' },
          ]}
          onPress={() => setActiveTab('reminders')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="alarm"
            size={20}
            color={activeTab === 'reminders' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'reminders' ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Reminders ({reminders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'notes' ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyNotes}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={renderReminder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyReminders}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={activeTab === 'notes' ? handleAddNote : handleAddReminder}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  itemCard: {
    marginBottom: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default NotesRemindersScreen;
