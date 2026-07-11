// Lista de tarefas da sala. Toque no círculo para concluir; lixeira remove.
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../components/Toast';
import { alternarTarefa, listarTarefas, removerTarefa } from '../database/db';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function ListaTarefasScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const toast = useToast();
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
          await carregar();
          toast('Tarefa removida.');
        },
      },
    ]);
  }

  function renderTarefa({ item }) {
    const concluida = !!item.concluida;
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => alternar(item)}
          hitSlop={6}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: concluida }}
        >
          <Ionicons
            name={concluida ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={concluida ? colors.success : colors.onPrimary}
          />
        </Pressable>
        <View style={styles.cardText}>
          <Text style={[styles.titulo, concluida && styles.concluida]}>
            {item.titulo}
          </Text>
          {item.descricao ? (
            <Text style={styles.descricao}>{item.descricao}</Text>
          ) : null}
          {item.entrega ? (
            <View style={styles.entregaRow}>
              <Ionicons name="calendar-outline" size={12} color={colors.onPrimaryMuted} />
              <Text style={styles.entrega}>Entrega: {item.entrega}</Text>
            </View>
          ) : null}
        </View>
        <Pressable
          onPress={() => confirmarRemocao(item)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.titulo}`}
        >
          <Ionicons name="trash-outline" size={20} color={colors.onPrimaryMuted} />
        </Pressable>
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
        ListHeaderComponent={
          <View>
            <TitleCard title="TAREFAS" icon="list-outline" />
            <View style={styles.acao}>
              <PrimaryButton
                title="Adicionar tarefa"
                icon="add"
                variant="ghost"
                full
                onPress={() => navigation.navigate('AdicionarTarefa', { salaId })}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-outline"
            message="Nenhuma tarefa cadastrada."
            actionLabel="Adicionar tarefa"
            actionIcon="add"
            onAction={() => navigation.navigate('AdicionarTarefa', { salaId })}
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
  acao: {
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  cardText: {
    flex: 1,
    marginHorizontal: spacing.md,
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
    marginTop: 3,
    lineHeight: 18,
  },
  entregaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  entrega: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginLeft: 4,
  },
});
