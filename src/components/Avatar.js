// Avatar circular do professor (ícone genérico) com anel e leve sombra.
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme/theme';

export default function Avatar({ size = 56 }) {
  return (
    <View
      style={[
        styles.ring,
        { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 },
      ]}
    >
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Ionicons name="person" size={size * 0.55} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardStrong,
    ...shadow.sm,
  },
  circle: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
