// Botão de ação. Variantes: "primary" (branco) e "ghost" (contorno).
// Suporta ícone, estado de carregamento e largura total.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  icon,
  variant = 'primary',
  full,
}) {
  const isPrimary = variant === 'primary';
  const corConteudo = isPrimary ? colors.primary : colors.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.btn,
        isPrimary ? styles.primary : styles.ghost,
        full && styles.full,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Ionicons name={icon} size={18} color={corConteudo} style={styles.icon} />
          ) : null}
          <Text style={[styles.text, { color: corConteudo }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 180,
  },
  primary: {
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.onPrimaryMuted,
  },
  full: {
    alignSelf: 'stretch',
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});
