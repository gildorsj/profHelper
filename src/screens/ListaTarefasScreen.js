// Lista de tarefas da sala. Toque para marcar como concluída; lixeira remove.
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import { alternarTarefa, listarTarefas, removerTarefa } from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function ListaTarefasScreen({ route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;
  const [tarefas, setTarefas] = useState([]);

  const carregar = useCallback(() => {
    return listarTarefas(db, salaId).then(setTarefas);
  }, [db, salaId]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarTarefas(db, salaId).then((rows) => {
        if (ativo) setTarefas(rows);
      });
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

  async function alternar(tarefa) {
    await alternarTarefa(db, tarefa.id, !tarefa.concluida);
    carregar();
  }

  function confirmarRemocao(tarefa) {
    Alert.alert('Remover tarefa', `Remover "${tarefa.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await removerTarefa(db, tarefa.id);
          carregar();
        },
      },
    ]);
  }

  function renderTarefa({ item }) {
    const concluida = !!item.concluida;
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => alternar(item)} style={styles.check}>
          <Ionicons
            name={concluida ? 'checkbox' : 'square-outline'}
            size={24}
            color={colors.onPrimary}
          />
        </TouchableOpacity>
        <View style={styles.cardText}>
          <Text style={[styles.titulo, concluida && styles.concluida]}>
            {item.titulo}
          </Text>
          {item.descricao ? (
            <Text style={styles.descricao}>{item.descricao}</Text>
          ) : null}
          {item.entrega ? (
            <Text style={styles.entrega}>Entrega: {item.entrega}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => confirmarRemocao(item)}>
          <Ionicons name="trash-outline" size={20} color={colors.onPrimaryMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTarefa}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<TitleCard title="TAREFAS" />}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            message={'Nenhuma tarefa cadastrada.\nUse "Adicionar tarefa".'}
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
    alignItems: 'flex-start',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  check: {
    marginRight: spacing.sm,
  },
  cardText: {
    flex: 1,
  },
  titulo: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  concluida: {
    textDecorationLine: 'line-through',
    color: colors.onPrimaryMuted,
  },
  descricao: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  entrega: {
    color: colors.onPrimary,
    fontSize: typography.small,
    marginTop: 4,
  },
});
