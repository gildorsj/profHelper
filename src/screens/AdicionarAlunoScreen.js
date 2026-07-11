// Adicionar aluno a uma sala: nome, matrícula e e-mail.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../components/Toast';
import { adicionarAluno } from '../database/db';
import { spacing } from '../theme/theme';

export default function AdicionarAlunoScreen({ route }) {
  const db = useSQLiteContext();
  const toast = useToast();
  const { salaId } = route.params;

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function adicionar() {
    if (!nome.trim()) {
      setErro('Informe o nome do aluno.');
      return;
    }
    setErro('');
    setSalvando(true);
    await adicionarAluno(db, {
      salaId,
      nome: nome.trim(),
      matricula: matricula.trim(),
      email: email.trim(),
    });
    setSalvando(false);
    // Limpa o formulário para permitir cadastrar vários alunos em sequência.
    setNome('');
    setMatricula('');
    setEmail('');
    toast('Aluno adicionado com sucesso.');
  }

  return (
    <Screen avoidKeyboard>
      <TitleCard title="ADICIONAR ALUNO" icon="person-add-outline" />

      <Field
        label="NOME DO ALUNO"
        icon="person-outline"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          if (erro) setErro('');
        }}
        placeholder="Nome completo"
        error={erro}
      />
      <Field
        label="MATRÍCULA"
        icon="id-card-outline"
        value={matricula}
        onChangeText={setMatricula}
        placeholder="Número de matrícula"
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="EMAIL DO ALUNO"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.acao}>
        <PrimaryButton
          title="Adicionar aluno"
          icon="person-add"
          onPress={adicionar}
          loading={salvando}
          full
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  acao: {
    marginTop: spacing.md,
  },
});
