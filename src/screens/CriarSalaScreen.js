// Sala nova: nome + confirmação do nome + informações da matéria.
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { criarSala } from '../database/db';
import { spacing } from '../theme/theme';

export default function CriarSalaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const online = route.params?.online ? 1 : 0;

  const [nome, setNome] = useState('');
  const [confirma, setConfirma] = useState('');
  const [informacoes, setInformacoes] = useState('');

  async function criar() {
    const n = nome.trim();
    if (!n) {
      Alert.alert('Atenção', 'Digite o nome da sala.');
      return;
    }
    if (n !== confirma.trim()) {
      Alert.alert('Atenção', 'Os nomes da sala não coincidem.');
      return;
    }
    const salaId = await criarSala(db, {
      nome: n,
      informacoes: informacoes.trim(),
      online,
    });
    // Vai direto para a sala criada para começar a cadastrar os alunos.
    navigation.replace('Sala', { salaId });
  }

  return (
    <Screen>
      <TitleCard
        title="SALA NOVA"
        subtitle={online ? 'sala online' : 'sala presencial'}
      />

      <Field
        label="NOME DA SALA"
        value={nome}
        onChangeText={setNome}
        placeholder="Ex.: Algoritmos I"
      />
      <Field
        label="CONFIRME O NOME DA SALA"
        value={confirma}
        onChangeText={setConfirma}
        placeholder="Repita o nome da sala"
      />
      <Field
        label="INFORMAÇÕES DA MATÉRIA"
        value={informacoes}
        onChangeText={setInformacoes}
        placeholder="Horários, período, observações..."
        multiline
      />

      <View style={styles.acao}>
        <PrimaryButton title="criar" onPress={criar} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  acao: {
    marginTop: spacing.md,
  },
});
