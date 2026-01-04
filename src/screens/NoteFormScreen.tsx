// NoteFormScreen - Create or edit a note

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeColors } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectNoteById, createNote, updateNote } from '@/slices';
import { Button, Input } from '@/components/common';
import type { RootStackScreenProps } from '@/navigation/types';
import { getTodayString } from '@/utils/dateHelpers';
import { COLOR_PRESETS } from '@/types';

type RouteProps = RootStackScreenProps<'NoteForm'>['route'];
type NavigationProp = RootStackScreenProps<'NoteForm'>['navigation'];

const NoteFormScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();

  const { noteId, date } = route.params || {};
  const existingNote = useAppSelector((state) =>
    noteId ? selectNoteById(state, noteId) : undefined
  );

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [selectedColor, setSelectedColor] = useState(
    existingNote?.color || COLOR_PRESETS[0]
  );
  const [noteDate] = useState(existingNote?.date || date || getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    navigation.setOptions({
      title: existingNote ? 'Edit Note' : 'New Note',
    });
  }, [navigation, existingNote]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (existingNote) {
        await dispatch(
          updateNote({
            id: existingNote.id,
            title: title.trim(),
            content: content.trim(),
            color: selectedColor,
          })
        ).unwrap();
      } else {
        await dispatch(
          createNote({
            title: title.trim(),
            content: content.trim(),
            date: noteDate,
            color: selectedColor,
          })
        ).unwrap();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    navigation,
    existingNote,
    title,
    content,
    selectedColor,
    noteDate,
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter note title"
          error={errors.title}
          autoFocus={!existingNote}
        />

        <Input
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder="Write your note here..."
          multiline
          numberOfLines={8}
        />

        <View style={styles.colorSection}>
          <Text style={[styles.label, { color: colors.text }]}>Color</Text>
          <View style={styles.colorGrid}>
            {COLOR_PRESETS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorSelected,
                ]}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.7}
              >
                {selectedColor === color && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.dateInfo}>
          <Text style={[styles.label, { color: colors.text }]}>Date</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(noteDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.actions, { backgroundColor: colors.surface }]}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.actionButton}
        />
        <Button
          title={existingNote ? 'Save Changes' : 'Create Note'}
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
  colorSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  dateInfo: {
    marginBottom: 24,
  },
  dateText: {
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

export default NoteFormScreen;
