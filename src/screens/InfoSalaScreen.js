// Informações da sala: dados gerais, aulas lecionadas e frequência (%).
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SectionLabel from '../components/SectionLabel';
import FrequencyBadge from '../components/FrequencyBadge';
import ProgressBar from '../components/ProgressBar';
import {
  frequenciaDosAlunos,
  frequenciaGeralSala,
  getSala,
} from '../database/db';
import { colors, corFrequencia, radius, shadow, spacing, typography } from '../theme/theme';

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

  const temAulas = geral.totalAulas > 0;
  const corGeral = temAulas ? corFrequencia(geral.percentual) : colors.onPrimaryFaint;

  const cabecalho = (
    <View>
      <TitleCard
        title="Informações da sala"
        subtitle={sala ? sala.nome : ''}
        icon="stats-chart-outline"
      />

      {sala && sala.informacoes ? (
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>{sala.informacoes}</Text>
        </Card>
      ) : null}

      {/* Painel de frequência geral */}
      <Card style={styles.hero}>
        <View style={styles.heroLeft}>
          <View style={styles.tag}>
            <Ionicons
              name={sala && sala.online ? 'globe-outline' : 'easel-outline'}
              size={14}
              color={colors.onPrimaryMuted}
            />
            <Text style={styles.tagTexto}>
              {sala && sala.online ? 'Sala online' : 'Sala presencial'}
            </Text>
          </View>
          <Text style={styles.aulasNum}>{geral.totalAulas}</Text>
          <Text style={styles.aulasRot}>aula(s) lecionada(s)</Text>
          <View style={styles.alunosRow}>
            <Ionicons name="people-outline" size={13} color={colors.onPrimaryMuted} />
            <Text style={styles.alunosRot}>{alunos.length} aluno(s)</Text>
          </View>
        </View>

        <View style={[styles.ring, { borderColor: corGeral }]}>
          <Text style={[styles.ringNum, { color: corGeral }]}>
            {geral.percentual}%
          </Text>
          <Text style={styles.ringRot}>{temAulas ? 'freq. geral' : 'sem aulas'}</Text>
        </View>
      </Card>

      {alunos.length > 0 ? (
        <SectionLabel>Frequência por aluno</SectionLabel>
      ) : null}
    </View>
  );

  function renderAluno({ item }) {
    const alunoTemAulas = item.registros > 0;
    return (
      <View style={styles.card}>
        <View style={styles.iconChip}>
          <Ionicons name="person" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>
          <ProgressBar
            value={item.percentual}
            color={alunoTemAulas ? corFrequencia(item.percentual) : colors.onPrimaryFaint}
            style={styles.barra}
          />
        </View>
        {alunoTemAulas ? (
          <FrequencyBadge percentual={item.percentual} />
        ) : (
          <View style={styles.semChip}>
            <Text style={styles.semTexto}>—</Text>
          </View>
        )}
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
  infoCard: {
    marginBottom: spacing.md,
  },
  infoText: {
    color: colors.onPrimary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroLeft: {
    flex: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tagTexto: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginLeft: 5,
  },
  aulasNum: {
    color: colors.onPrimary,
    fontSize: typography.hero,
    fontWeight: '800',
  },
  aulasRot: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
  },
  alunosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  alunosRot: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginLeft: 5,
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNum: {
    fontSize: typography.title,
    fontWeight: '800',
  },
  ringRot: {
    color: colors.onPrimaryMuted,
    fontSize: 10,
    marginTop: 2,
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
    marginRight: spacing.sm,
  },
  nome: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  barra: {
    marginTop: 8,
  },
  semChip: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.cardStrong,
  },
  semTexto: {
    color: colors.onPrimaryMuted,
    fontWeight: '800',
    fontSize: typography.body,
  },
});
