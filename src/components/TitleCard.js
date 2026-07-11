// Cartão branco de título (ex.: "SALA VIRTUAL" + nome da sala).
// Ícone opcional exibido em um medalhão vermelho acima do título.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function TitleCard({ title, subtitle, icon }) {
  return (
    <View style={styles.card}>
      {icon ? (
        <View style={styles.medalhao}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.md,
  },
  medalhao: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(193,39,45,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.onSurface,
    fontSize: typography.title,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.onSurfaceMuted,
    fontSize: typography.subtitle,
    marginTop: 4,
    textAlign: 'center',
  },
});
