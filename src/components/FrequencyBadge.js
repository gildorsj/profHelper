// Chip claro que mostra a frequência (%) com cor semântica:
// verde (boa), âmbar (atenção) e vermelho (crítica).
import { StyleSheet, Text, View } from 'react-native';
import { colors, corFrequencia, radius, typography } from '../theme/theme';

export default function FrequencyBadge({ percentual }) {
  const cor = corFrequencia(percentual);
  return (
    <View style={styles.chip}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.texto, { color: cor }]}>{percentual}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 64,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  texto: {
    fontWeight: '800',
    fontSize: typography.small,
  },
});
