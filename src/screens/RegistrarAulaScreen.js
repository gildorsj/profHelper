// Registrar aula (chamada): marca presença/falta de cada aluno e salva.
// É esta tela que gera os dados de frequência exibidos no restante do app.
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Card from '../components/Card';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import SectionLabel from '../components/SectionLabel';
import EmptyState from '../components/EmptyState';
import PresencaToggle from '../components/PresencaToggle';
import { useToast } from '../components/Toast';
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
  const toast = useToast();
  const { salaId } = route.params;

  const [sala, setSala] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({}); // { alunoId: true/false }
  const [conteudo, setConteudo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const hoje = dataHoje();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([listarAlunos(db, salaId), getSala(db, salaId)]).then(
        ([lista, s]) => {
          if (!ativo) return;
          setAlunos(lista);
          setSala(s);
          const inicial = {};
          lista.forEach((a) => {
            inicial[a.id] = true; // todos começam presentes
          });
          setPresencas(inicial);
        }
      );
      return () => {
        ativo = false;
      };
    }, [db, salaId])
  );

  function marcarTodos(valor) {
    const novo = {};
    alunos.forEach((a) => {
      novo[a.id] = valor;
    });
    setPresencas(novo);
  }

  async function salvar() {
    const lista = alunos.map((a) => ({ alunoId: a.id, presente: presencas[a.id] }));
    setSalvando(true);
    await registrarAula(db, {
      salaId,
      data: hoje,
      conteudo: conteudo.trim(),
      presencas: lista,
    });
    setSalvando(false);
    const totalPresentes = lista.filter((p) => p.presente).length;
    toast(`Chamada salva: ${totalPresentes}/${lista.length} presente(s).`);
    navigation.goBack();
  }

  if (alunos.length === 0) {
    return (
      <Screen>
        <TitleCard
          title="REGISTRAR AULA"
          subtitle={sala ? sala.nome : ''}
          icon="checkbox-outline"
        />
        <EmptyState
          icon="people-outline"
          message="Cadastre alunos nesta sala antes de registrar a chamada."
          actionLabel="Adicionar aluno"
          actionIcon="person-add"
          onAction={() => navigation.navigate('AdicionarAluno', { salaId })}
        />
      </Screen>
    );
  }

  const totalPresentes = alunos.filter((a) => presencas[a.id]).length;
  const totalFaltas = alunos.length - totalPresentes;

  return (
    <Screen avoidKeyboard>
      <TitleCard
        title="REGISTRAR AULA"
        subtitle={`${sala ? sala.nome : ''} • ${formatarData(hoje)}`}
        icon="checkbox-outline"
      />

      <Field
        label="CONTEÚDO DA AULA (OPCIONAL)"
        icon="document-text-outline"
        value={conteudo}
        onChangeText={setConteudo}
        placeholder="Ex.: Introdução a vetores"
      />

      {/* Resumo ao vivo */}
      <Card style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={[styles.resumoNum, { color: colors.success }]}>
            {totalPresentes}
          </Text>
          <Text style={styles.resumoRot}>Presentes</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.resumoItem}>
          <Text style={[styles.resumoNum, { color: colors.badge }]}>
            {totalFaltas}
          </Text>
          <Text style={styles.resumoRot}>Faltas</Text>
        </View>
      </Card>

      <View style={styles.atalhos}>
        <Pressable style={styles.chip} onPress={() => marcarTodos(true)}>
          <Ionicons name="checkmark-done" size={14} color={colors.onPrimary} />
          <Text style={styles.chipTexto}>Todos presentes</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={() => marcarTodos(false)}>
          <Ionicons name="close" size={14} color={colors.onPrimary} />
          <Text style={styles.chipTexto}>Todos ausentes</Text>
        </Pressable>
      </View>

      <SectionLabel>Chamada</SectionLabel>
      {alunos.map((aluno) => (
        <View key={aluno.id} style={styles.row}>
          <Ionicons name="person-outline" size={18} color={colors.onPrimary} />
          <Text style={styles.nome} numberOfLines={1}>
            {aluno.nome}
          </Text>
          <PresencaToggle
            presente={presencas[aluno.id]}
            onChange={(v) => setPresencas((cur) => ({ ...cur, [aluno.id]: v }))}
          />
        </View>
      ))}

      <View style={styles.acao}>
        <PrimaryButton
          title="Salvar chamada"
          icon="save-outline"
          onPress={salvar}
          loading={salvando}
          full
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resumoItem: {
    flex: 1,
    alignItems: 'center',
  },
  resumoNum: {
    fontSize: typography.hero,
    fontWeight: '800',
  },
  resumoRot: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  atalhos: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
  },
  chipTexto: {
    color: colors.onPrimary,
    fontSize: typography.small,
    fontWeight: '600',
    marginLeft: 5,
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
    marginRight: spacing.sm,
  },
  acao: {
    marginTop: spacing.lg,
  },
});
