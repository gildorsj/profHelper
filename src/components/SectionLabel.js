// Rótulo de seção (texto pequeno, maiúsculo e espaçado) para agrupar áreas.
import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export default function SectionLabel({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: colors.onPrimaryFaint,
    fontSize: typography.tiny,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
});
