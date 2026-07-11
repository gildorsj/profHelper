// Container padrão das telas: fundo vermelho + espaçamento.
// scroll={true} usa ScrollView; avoidKeyboard envolve em KeyboardAvoidingView.
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '../theme/theme';

export default function Screen({
  children,
  scroll = true,
  contentStyle,
  avoidKeyboard = false,
}) {
  const conteudo = scroll ? (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.bg, styles.content, contentStyle]}>{children}</View>
  );

  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.bg}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {conteudo}
      </KeyboardAvoidingView>
    );
  }

  return conteudo;
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
