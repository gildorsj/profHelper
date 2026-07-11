// Lista de alunos com a frequência de cada um (presenças e faltas).
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import { frequenciaDosAlunos, getSala } from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function ListaAlunosScreen({ route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;
  const [alunos, setAlunos] = useState([]);
  const [sala, setSala] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([frequenciaDosAlunos(db, salaId), getSala(db, salaId)]).then(
        ([lista, s]) => {
          if (ativo) {
            setAlunos(lista);
            setSala(s);
          }
        }
      );
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

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
        {/* Caixa de presenças (salmão) + faltas ao lado, como no protótipo */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.presencas}</Text>
        </View>
        <Text style={styles.faltas}>{item.faltas}</Text>
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
          <View>
            <TitleCard title="LISTA ALUNOS" subtitle={sala ? sala.nome : ''} />
            <View style={styles.cabecalho}>
              <Text style={styles.cabTitulo}>Alunos</Text>
              <Text style={styles.cabTitulo}>Frequência</Text>
            </View>
            <View style={styles.legenda}>
              <View style={styles.legItem}>
                <View style={styles.badgeMini} />
                <Text style={styles.legTexto}>presenças</Text>
              </View>
              <Text style={styles.legTexto}>faltas</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            message={'Nenhum aluno cadastrado nesta sala.\nUse "Adicionar aluno".'}
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
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  cabTitulo: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: typography.body,
  },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  badgeMini: {
    width: 14,
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.badge,
    marginRight: spacing.xs,
  },
  legTexto: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
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
  badge: {
    backgroundColor: colors.badge,
    borderRadius: radius.sm,
    minWidth: 34,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  badgeText: {
    color: colors.badgeText,
    fontWeight: '700',
    fontSize: typography.body,
  },
  faltas: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
});
