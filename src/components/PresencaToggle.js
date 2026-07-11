// Controle segmentado Presente / Falta (usado na chamada).
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../theme/theme';

export default function PresencaToggle({ presente, onChange }) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(true)}
        style={[styles.seg, presente && styles.segPresente]}
        accessibilityRole="button"
        accessibilityLabel="Marcar presente"
      >
        <Ionicons
          name="checkmark"
          size={15}
          color={presente ? colors.onPrimary : colors.onPrimaryFaint}
        />
        <Text style={[styles.texto, presente ? styles.textoOn : styles.textoOff]}>
          Presente
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange(false)}
        style={[styles.seg, !presente && styles.segFalta]}
        accessibilityRole="button"
        accessibilityLabel="Marcar falta"
      >
        <Ionicons
          name="close"
          size={15}
          color={!presente ? colors.onPrimary : colors.onPrimaryFaint}
        />
        <Text style={[styles.texto, !presente ? styles.textoOn : styles.textoOff]}>
          Falta
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: radius.pill,
    padding: 3,
  },
  seg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  segPresente: {
    backgroundColor: colors.success,
  },
  segFalta: {
    backgroundColor: colors.danger,
  },
  texto: {
    fontSize: typography.tiny,
    fontWeight: '700',
    marginLeft: 4,
  },
  textoOn: {
    color: colors.onPrimary,
  },
  textoOff: {
    color: colors.onPrimaryFaint,
  },
});
