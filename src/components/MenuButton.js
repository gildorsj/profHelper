// Item de menu em formato de cartão, com ícone em destaque e feedback de toque.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

const CLARO_VERMELHO = '#FFC9C4'; // tom suave para ações destrutivas sobre o vermelho

export default function MenuButton({ icon, label, subtitle, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconChip, danger && styles.iconChipDanger]}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? CLARO_VERMELHO : colors.onPrimary}
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.label, danger && { color: CLARO_VERMELHO }]}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.onPrimaryFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  pressed: {
    opacity: 0.82,
    backgroundColor: colors.cardStrong,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.cardStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconChipDanger: {
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
});
