// Item de menu (linha com ícone + texto), como nas telas do protótipo.
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

export default function MenuButton({ icon, label, subtitle, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.badge : colors.onPrimary}
        style={styles.icon}
      />
      <View style={styles.textWrap}>
        <Text style={[styles.label, danger && styles.dangerText]}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.onPrimaryMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  icon: {
    width: 30,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: colors.onPrimary,
    fontSize: typography.body,
  },
  dangerText: {
    color: colors.badge,
  },
  subtitle: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
});
