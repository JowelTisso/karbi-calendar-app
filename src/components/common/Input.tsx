// Input component - Text input with label and error support

import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useThemeColors } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      containerStyle,
      multiline = false,
      numberOfLines = 1,
      style,
      ...props
    },
    ref
  ) => {
    const colors = useThemeColors();

    const inputHeight = multiline ? Math.max(48, numberOfLines * 24 + 24) : 48;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.error : colors.border,
              color: colors.text,
              height: inputHeight,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            multiline && styles.multiline,
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}
        {helperText && !error && (
          <Text style={[styles.helper, { color: colors.textSecondary }]}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  multiline: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  helper: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
