// Botão de ação branco com texto vermelho (ex.: "adicionar", "criar").
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 160,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
