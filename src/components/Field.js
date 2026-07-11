// Campo de formulário (rótulo + input) com destaque de foco, ícone opcional
// e mensagem de erro inline.
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function Field({
  label,
  style,
  multiline,
  error,
  icon,
  onFocus,
  onBlur,
  ...props
}) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrap,
          multiline && styles.multilineWrap,
          focado && styles.focado,
          error && styles.errado,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focado ? colors.onPrimary : colors.onPrimaryFaint}
            style={styles.leadingIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholderTextColor={colors.placeholder}
          multiline={multiline}
          onFocus={(e) => {
            setFocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={colors.badge} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.onPrimary,
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  multilineWrap: {
    alignItems: 'flex-start',
  },
  focado: {
    borderColor: colors.inputBorderFocus,
  },
  errado: {
    borderColor: colors.badge,
  },
  leadingIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: typography.body,
    paddingVertical: spacing.sm + 2,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: spacing.sm + 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorText: {
    color: colors.badge,
    fontSize: typography.small,
    marginLeft: 4,
  },
});
