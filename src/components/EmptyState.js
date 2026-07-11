// Mensagem exibida quando uma lista está vazia.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

export default function EmptyState({ icon = 'file-tray-outline', message }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={54} color={colors.onPrimaryMuted} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  text: {
    color: colors.onPrimaryMuted,
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
