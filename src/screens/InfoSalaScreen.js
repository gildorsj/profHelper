// Informações da sala: dados gerais, aulas lecionadas e frequência (%).
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import {
  frequenciaDosAlunos,
  frequenciaGeralSala,
  getSala,
} from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function InfoSalaScreen({ route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;

  const [sala, setSala] = useState(null);
  const [geral, setGeral] = useState({ totalAulas: 0, percentual: 0 });
  const [alunos, setAlunos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([
        getSala(db, salaId),
        frequenciaGeralSala(db, salaId),
        frequenciaDosAlunos(db, salaId),
      ]).then(([s, g, lista]) => {
        if (!ativo) return;
        setSala(s);
        setGeral(g);
        setAlunos(lista);
      });
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

  const cabecalho = (
    <View>
      <TitleCard title="Informações da sala" subtitle={sala ? sala.nome : ''} />

      <View style={styles.painel}>
        {sala && sala.informacoes ? (
          <Text style={styles.info}>{sala.informacoes}</Text>
        ) : null}

        <View style={styles.painelLinha}>
          <View style={styles.painelEsq}>
            <View style={styles.tag}>
              <Ionicons
                name={sala && sala.online ? 'globe-outline' : 'easel-outline'}
                size={16}
                color={colors.onSurfaceMuted}
              />
              <Text style={styles.tagTexto}>
                {sala && sala.online ? 'Sala online' : 'Sala presencial'}
              </Text>
            </View>
            <Text style={styles.aulas}>{geral.totalAulas} aula(s) lecionada(s)</Text>
            <Text style={styles.aulasSub}>{alunos.length} aluno(s)</Text>
          </View>

          {/* Círculo com a frequência geral, como no protótipo */}
          <View style={styles.circulo}>
            <Text style={styles.circuloNum}>{geral.percentual}%</Text>
            <Text style={styles.circuloLabel}>freq. geral</Text>
          </View>
        </View>
      </View>

      <View style={styles.cabecalho}>
        <Text style={styles.cabTitulo}>Alunos</Text>
        <Text style={styles.cabTitulo}>Frequência (%)</Text>
      </View>
    </View>
  );

  function renderAluno({ item }) {
    return (
      <View style={styles.row}>
        <Ionicons name="person-outline" size={20} color={colors.onPrimary} />
        <Text style={styles.nome}>{item.nome}</Text>
        <View style={styles.percentBox}>
          <Text style={styles.percentTexto}>{item.percentual}%</Text>
        </View>
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
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <EmptyState
            icon="stats-chart-outline"
            message="Sem alunos para calcular a frequência."
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
  painel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  info: {
    color: colors.onSurface,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
  painelLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  painelEsq: {
    flex: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tagTexto: {
    color: colors.onSurfaceMuted,
    fontSize: typography.small,
    marginLeft: 4,
  },
  aulas: {
    color: colors.onSurface,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  aulasSub: {
    color: colors.onSurfaceMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  circulo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloNum: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  circuloLabel: {
    color: colors.onSurfaceMuted,
    fontSize: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  nome: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: typography.body,
    marginLeft: spacing.sm,
  },
  percentBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    minWidth: 56,
    alignItems: 'center',
  },
  percentTexto: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: typography.body,
  },
});
