// Estado vazio: ícone, mensagem e (opcionalmente) um botão de ação.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function EmptyState({
  icon = 'file-tray-outline',
  message,
  actionLabel,
  actionIcon,
  onAction,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={44} color={colors.onPrimaryMuted} />
      </View>
      <Text style={styles.text}>{message}</Text>
      {actionLabel ? (
        <View style={styles.action}>
          <PrimaryButton title={actionLabel} icon={actionIcon} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  circle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  text: {
    color: colors.onPrimaryMuted,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.lg,
  },
});
