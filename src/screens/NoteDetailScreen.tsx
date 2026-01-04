// NoteDetailScreen - View and manage a single note

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
import { selectNoteById, deleteNote } from '@/slices';
import { Button, Card } from '@/components/common';
import type { RootStackScreenProps } from '@/navigation/types';
import { formatFullDate } from '@/utils/dateHelpers';

type RouteProps = RootStackScreenProps<'NoteDetail'>['route'];
type NavigationProp = RootStackScreenProps<'NoteDetail'>['navigation'];

const NoteDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const { noteId } = route.params;

  const note = useAppSelector((state) => selectNoteById(state, noteId));

  const handleEdit = useCallback(() => {
    navigation.navigate('NoteForm', { noteId });
  }, [navigation, noteId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteNote(noteId));
            navigation.goBack();
          },
        },
      ]
    );
  }, [dispatch, navigation, noteId]);

  if (!note) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            Note not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.colorBadge, { backgroundColor: note.color || colors.note }]} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatFullDate(new Date(note.date))}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>

          {note.content && (
            <Text style={[styles.contentText, { color: colors.text }]}>
              {note.content}
            </Text>
          )}

          <View style={[styles.meta, { borderTopColor: colors.border }]}>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </Text>
            {note.updatedAt !== note.createdAt && (
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                Updated: {new Date(note.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.actions, { backgroundColor: colors.surface }]}>
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
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  colorBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  meta: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 4,
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
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  actionButton: {
    flex: 1,
  },
});

export default NoteDetailScreen;
