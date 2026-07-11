// Remover aluno da sala (com confirmação).
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import { listarAlunos, removerAluno } from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function RemoverAlunoScreen({ route }) {
  const db = useSQLiteContext();
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
            carregar();
          },
        },
      ]
    );
  }

  function renderAluno({ item }) {
    return (
      <View style={styles.row}>
        <Ionicons name="person-outline" size={20} color={colors.onPrimary} />
        <View style={styles.nomeWrap}>
          <Text style={styles.nome}>{item.nome}</Text>
          {item.matricula ? (
            <Text style={styles.matricula}>Mat. {item.matricula}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.btnRemover}
          onPress={() => confirmarRemocao(item)}
        >
          <Ionicons name="trash-outline" size={22} color={colors.onPrimary} />
        </TouchableOpacity>
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
        ListHeaderComponent={<TitleCard title="REMOVER ALUNO" />}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  nomeWrap: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  nome: {
    color: colors.onPrimary,
    fontSize: typography.body,
  },
  matricula: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
  },
  btnRemover: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
  },
});
