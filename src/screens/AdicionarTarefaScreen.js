// Adicionar tarefa/atividade a uma sala.
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { adicionarTarefa } from '../database/db';
import { spacing } from '../theme/theme';

export default function AdicionarTarefaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [entrega, setEntrega] = useState('');

  async function adicionar() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título da tarefa.');
      return;
    }
    await adicionarTarefa(db, {
      salaId,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      entrega: entrega.trim(),
    });
    Alert.alert('Pronto', 'Tarefa adicionada com sucesso.');
    navigation.goBack();
  }

  return (
    <Screen>
      <TitleCard title="ADICIONAR TAREFA" />

      <Field
        label="TÍTULO"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Lista de exercícios 1"
      />
      <Field
        label="DESCRIÇÃO"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Detalhes da tarefa..."
        multiline
      />
      <Field
        label="DATA DE ENTREGA"
        value={entrega}
        onChangeText={setEntrega}
        placeholder="Ex.: 20/07/2026"
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
