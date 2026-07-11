// Barra de progresso simples (0 a 100). Cor personalizável.
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme/theme';

export default function ProgressBar({ value = 0, color = colors.onPrimary, height = 6, style }) {
  const largura = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, borderRadius: height }, style]}>
      <View
        style={[
          styles.fill,
          { width: `${largura}%`, backgroundColor: color, borderRadius: height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
