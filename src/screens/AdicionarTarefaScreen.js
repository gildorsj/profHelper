// Adicionar tarefa/atividade a uma sala.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../components/Toast';
import { adicionarTarefa } from '../database/db';
import { spacing } from '../theme/theme';

export default function AdicionarTarefaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const toast = useToast();
  const { salaId } = route.params;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [entrega, setEntrega] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function adicionar() {
    if (!titulo.trim()) {
      setErro('Informe o título da tarefa.');
      return;
    }
    setErro('');
    setSalvando(true);
    await adicionarTarefa(db, {
      salaId,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      entrega: entrega.trim(),
    });
    setSalvando(false);
    toast('Tarefa adicionada com sucesso.');
    navigation.goBack();
  }

  return (
    <Screen avoidKeyboard>
      <TitleCard title="ADICIONAR TAREFA" icon="clipboard-outline" />

      <Field
        label="TÍTULO"
        icon="pricetag-outline"
        value={titulo}
        onChangeText={(t) => {
          setTitulo(t);
          if (erro) setErro('');
        }}
        placeholder="Ex.: Lista de exercícios 1"
        error={erro}
      />
      <Field
        label="DESCRIÇÃO"
        icon="document-text-outline"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Detalhes da tarefa..."
        multiline
      />
      <Field
        label="DATA DE ENTREGA"
        icon="calendar-outline"
        value={entrega}
        onChangeText={setEntrega}
        placeholder="Ex.: 20/07/2026"
      />

      <View style={styles.acao}>
        <PrimaryButton
          title="Adicionar tarefa"
          icon="add"
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
