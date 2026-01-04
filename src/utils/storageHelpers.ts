// AsyncStorage helper functions

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Generic save function with JSON serialization
export const saveToStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Storage save error (${key}):`, error);
    throw error;
  }
};

// Generic load function with JSON parsing
export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Storage load error (${key}):`, error);
    return null;
  }
};

// Remove item from storage
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Storage remove error (${key}):`, error);
    throw error;
  }
};

// Clear all app storage
export const clearStorage = async (): Promise<void> => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Storage clear error:', error);
    throw error;
  }
};

// Get all storage keys
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    // Filter to only app keys
    return keys.filter(key => key.startsWith('@calendar_app/'));
  } catch (error) {
    console.error('Storage getAllKeys error:', error);
    return [];
  }
};

// Check if key exists
export const storageKeyExists = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Storage keyExists error (${key}):`, error);
    return false;
  }
};

// Multi-get helper
export const multiGet = async <T>(keys: string[]): Promise<Map<string, T | null>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result = new Map<string, T | null>();

    for (const [key, value] of pairs) {
      result.set(key, value ? JSON.parse(value) as T : null);
    }

    return result;
  } catch (error) {
    console.error('Storage multiGet error:', error);
    return new Map();
  }
};

// Multi-set helper
export const multiSet = async (data: Array<[string, unknown]>): Promise<void> => {
  try {
    const pairs: [string, string][] = data.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Storage multiSet error:', error);
    throw error;
  }
};

// Storage wrapper object for convenience
export const storage = {
  save: saveToStorage,
  load: loadFromStorage,
  remove: removeFromStorage,
  clear: clearStorage,
  getAllKeys,
  exists: storageKeyExists,
  multiGet,
  multiSet,
};

export default storage;

// Type-safe storage accessors for specific data types
export const notesStorage = {
  save: (data: unknown) => saveToStorage(STORAGE_KEYS.NOTES, data),
  load: <T>() => loadFromStorage<T>(STORAGE_KEYS.NOTES),
  clear: () => removeFromStorage(STORAGE_KEYS.NOTES),
};

export const remindersStorage = {
  save: (data: unknown) => saveToStorage(STORAGE_KEYS.REMINDERS, data),
  load: <T>() => loadFromStorage<T>(STORAGE_KEYS.REMINDERS),
  clear: () => removeFromStorage(STORAGE_KEYS.REMINDERS),
};

export const holidaysStorage = {
  save: (data: unknown) => saveToStorage(STORAGE_KEYS.HOLIDAYS, data),
  load: <T>() => loadFromStorage<T>(STORAGE_KEYS.HOLIDAYS),
  clear: () => removeFromStorage(STORAGE_KEYS.HOLIDAYS),
};

export const settingsStorage = {
  save: (data: unknown) => saveToStorage(STORAGE_KEYS.SETTINGS, data),
  load: <T>() => loadFromStorage<T>(STORAGE_KEYS.SETTINGS),
  clear: () => removeFromStorage(STORAGE_KEYS.SETTINGS),
};
