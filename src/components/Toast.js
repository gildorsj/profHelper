// Sistema de "toast": feedback rápido e não-bloqueante (substitui Alerts de
// sucesso). Fornecido por um Provider e consumido pelo hook useToast().
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null); // { mensagem, tipo }
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const timer = useRef(null);

  const esconder = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 24, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const mostrar = useCallback(
    (mensagem, tipo = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ mensagem, tipo });
      opacity.setValue(0);
      translateY.setValue(24);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
      timer.current = setTimeout(esconder, 2400);
    },
    [opacity, translateY, esconder]
  );

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrap,
            { bottom: insets.bottom + spacing.lg, opacity, transform: [{ translateY }] },
          ]}
        >
          <View
            style={[styles.toast, toast.tipo === 'error' ? styles.error : styles.success]}
          >
            <Ionicons
              name={toast.tipo === 'error' ? 'alert-circle' : 'checkmark-circle'}
              size={20}
              color={colors.onPrimary}
            />
            <Text style={styles.texto} numberOfLines={2}>
              {toast.mensagem}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    maxWidth: 480,
    ...shadow.lg,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.danger,
  },
  texto: {
    color: colors.onPrimary,
    fontSize: typography.small,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
});
