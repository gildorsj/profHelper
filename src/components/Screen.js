// Container padrão das telas: fundo vermelho + espaçamento.
// Por padrão é rolável (ScrollView); use scroll={false} para conteúdo fixo.
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

export default function Screen({ children, scroll = true, contentStyle }) {
  if (scroll) {
    return (
      <ScrollView
        style={styles.bg}
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.bg, styles.content, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.md,
    flexGrow: 1,
  },
});
