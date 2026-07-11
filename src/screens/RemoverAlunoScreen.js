// Remover aluno da sala (com confirmação).
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { listarAlunos, removerAluno } from '../database/db';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function RemoverAlunoScreen({ route }) {
  const db = useSQLiteContext();
  const toast = useToast();
  const { salaId } = route.params;
  const [alunos, setAlunos] = useState([]);

  const carregar = useCallback(() => {
    return listarAlunos(db, salaId).then(setAlunos);
  }, [db, salaId]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarAlunos(db, salaId).then((rows) => {
        if (ativo) setAlunos(rows);
      });
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

  function confirmarRemocao(aluno) {
    Alert.alert(
      'Remover aluno',
      `Deseja remover "${aluno.nome}"? A frequência dele também será apagada.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removerAluno(db, aluno.id);
            await carregar();
            toast('Aluno removido.');
          },
        },
      ]
    );
  }

  function renderAluno({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.iconChip}>
          <Ionicons name="person" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>
          {item.matricula ? (
            <Text style={styles.meta}>Mat. {item.matricula}</Text>
          ) : null}
        </View>
        <Pressable
          style={({ pressed }) => [styles.btnRemover, pressed && styles.pressed]}
          onPress={() => confirmarRemocao(item)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.nome}`}
        >
          <Ionicons name="trash-outline" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAluno}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <TitleCard title="REMOVER ALUNO" icon="person-remove-outline" />
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            message="Nenhum aluno cadastrado nesta sala."
          />
        }
      />
    </View>
  );
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  nome: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  meta: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  btnRemover: {
    width: 42,
    height: 42,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
