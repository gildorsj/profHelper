// Registrar aula (chamada): marca presença/ausência de cada aluno e salva.
// É esta tela que gera os dados de frequência exibidos no restante do app.
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import {
  dataHoje,
  formatarData,
  getSala,
  listarAlunos,
  registrarAula,
} from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function RegistrarAulaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;

  const [sala, setSala] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({}); // { alunoId: true/false }
  const [conteudo, setConteudo] = useState('');
  const hoje = dataHoje();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([listarAlunos(db, salaId), getSala(db, salaId)]).then(
        ([lista, s]) => {
          if (!ativo) return;
          setAlunos(lista);
          setSala(s);
          // Por padrão, todos começam como presentes.
          const inicial = {};
          lista.forEach((a) => {
            inicial[a.id] = true;
          });
          setPresencas(inicial);
        }
      );
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

  function alternar(alunoId) {
    setPresencas((atual) => ({ ...atual, [alunoId]: !atual[alunoId] }));
  }

  function marcarTodos(valor) {
    const novo = {};
    alunos.forEach((a) => {
      novo[a.id] = valor;
    });
    setPresencas(novo);
  }

  async function salvar() {
    const lista = alunos.map((a) => ({
      alunoId: a.id,
      presente: presencas[a.id],
    }));
    await registrarAula(db, {
      salaId,
      data: hoje,
      conteudo: conteudo.trim(),
      presencas: lista,
    });
    const totalPresentes = lista.filter((p) => p.presente).length;
    Alert.alert(
      'Chamada registrada',
      `${totalPresentes} de ${lista.length} presente(s).`
    );
    navigation.goBack();
  }

  if (alunos.length === 0) {
    return (
      <Screen>
        <TitleCard title="REGISTRAR AULA" subtitle={sala ? sala.nome : ''} />
        <EmptyState
          icon="people-outline"
          message={'Cadastre alunos nesta sala\nantes de registrar a chamada.'}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <TitleCard
        title="REGISTRAR AULA"
        subtitle={`${sala ? sala.nome : ''} • ${formatarData(hoje)}`}
      />

      <View style={styles.atalhos}>
        <TouchableOpacity onPress={() => marcarTodos(true)}>
          <Text style={styles.atalho}>Todos presentes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => marcarTodos(false)}>
          <Text style={styles.atalho}>Todos ausentes</Text>
        </TouchableOpacity>
      </View>

      {alunos.map((aluno) => {
        const presente = presencas[aluno.id];
        return (
          <TouchableOpacity
            key={aluno.id}
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => alternar(aluno.id)}
          >
            <Ionicons name="person-outline" size={20} color={colors.onPrimary} />
            <Text style={styles.nome}>{aluno.nome}</Text>
            <View
              style={[
                styles.pill,
                presente ? styles.pillPresente : styles.pillAusente,
              ]}
            >
              <Ionicons
                name={presente ? 'checkmark' : 'close'}
                size={16}
                color={colors.onPrimary}
              />
              <Text style={styles.pillTexto}>
                {presente ? 'Presente' : 'Ausente'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.acao}>
        <PrimaryButton title="salvar chamada" onPress={salvar} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  atalhos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  atalho: {
    color: colors.onPrimary,
    fontSize: typography.small,
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  nome: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: typography.body,
    marginLeft: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
    minWidth: 96,
    justifyContent: 'center',
  },
  pillPresente: {
    backgroundColor: colors.success,
  },
  pillAusente: {
    backgroundColor: colors.danger,
  },
  pillTexto: {
    color: colors.onPrimary,
    fontSize: typography.small,
    fontWeight: '700',
    marginLeft: 4,
  },
  acao: {
    marginTop: spacing.lg,
  },
});
