// Cartão translúcido com borda e sombra, usado para agrupar conteúdo.
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/theme';

export default function Card({ children, style, strong }) {
  return (
    <View style={[styles.card, strong && styles.strong, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    ...shadow.sm,
  },
  strong: {
    backgroundColor: colors.cardStrong,
  },
});
