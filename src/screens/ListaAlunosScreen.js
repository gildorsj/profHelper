// Lista de alunos com a frequência de cada um (presenças, faltas e %).
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import FrequencyBadge from '../components/FrequencyBadge';
import ProgressBar from '../components/ProgressBar';
import { frequenciaDosAlunos, getSala } from '../database/db';
import { colors, corFrequencia, radius, shadow, spacing, typography } from '../theme/theme';

function Legenda({ cor, texto }) {
  return (
    <View style={styles.legItem}>
      <View style={[styles.legDot, { backgroundColor: cor }]} />
      <Text style={styles.legTexto}>{texto}</Text>
    </View>
  );
}

export default function ListaAlunosScreen({ navigation, route }) {
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
    const temAulas = item.registros > 0;
    return (
      <View style={styles.card}>
        <View style={styles.iconChip}>
          <Ionicons name="person" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.meta}>
            {temAulas
              ? `${item.presencas} presença(s) · ${item.faltas} falta(s)`
              : 'Sem chamadas registradas'}
          </Text>
          <ProgressBar
            value={item.percentual}
            color={temAulas ? corFrequencia(item.percentual) : colors.onPrimaryFaint}
            style={styles.barra}
          />
        </View>
        {temAulas ? (
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
        ListHeaderComponent={
          <View>
            <TitleCard
              title="LISTA DE ALUNOS"
              subtitle={sala ? sala.nome : ''}
              icon="people-outline"
            />
            <View style={styles.acao}>
              <PrimaryButton
                title="Adicionar aluno"
                icon="person-add"
                variant="ghost"
                full
                onPress={() => navigation.navigate('AdicionarAluno', { salaId })}
              />
            </View>
            {alunos.length > 0 ? (
              <View style={styles.legenda}>
                <Legenda cor={colors.freqAlta} texto="Boa ≥75%" />
                <Legenda cor={colors.freqMedia} texto="Atenção 60–74%" />
                <Legenda cor={colors.freqBaixa} texto="Crítica <60%" />
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            message="Nenhum aluno cadastrado nesta sala."
            actionLabel="Adicionar aluno"
            actionIcon="person-add"
            onAction={() => navigation.navigate('AdicionarAluno', { salaId })}
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
    marginBottom: spacing.md,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  legItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 5,
  },
  legTexto: {
    color: colors.onPrimaryMuted,
    fontSize: typography.tiny,
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
  meta: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  barra: {
    marginTop: 6,
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
