// Adicionar aluno a uma sala: nome, matrícula e e-mail.
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { adicionarAluno } from '../database/db';
import { spacing } from '../theme/theme';

export default function AdicionarAlunoScreen({ route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');

  async function adicionar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno.');
      return;
    }
    await adicionarAluno(db, {
      salaId,
      nome: nome.trim(),
      matricula: matricula.trim(),
      email: email.trim(),
    });
    // Limpa o formulário para permitir cadastrar vários alunos em sequência.
    setNome('');
    setMatricula('');
    setEmail('');
    Alert.alert('Pronto', 'Aluno adicionado com sucesso.');
  }

  return (
    <Screen>
      <TitleCard title="ADICIONAR ALUNO" />

      <Field
        label="NOME DO ALUNO"
        value={nome}
        onChangeText={setNome}
        placeholder="Nome completo"
      />
      <Field
        label="MATRÍCULA"
        value={matricula}
        onChangeText={setMatricula}
        placeholder="Número de matrícula"
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="EMAIL DO ALUNO"
        value={email}
        onChangeText={setEmail}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.acao}>
        <PrimaryButton title="adicionar" onPress={adicionar} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  acao: {
    marginTop: spacing.md,
  },
});
