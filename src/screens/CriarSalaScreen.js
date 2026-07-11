// Sala nova: nome + confirmação do nome + informações da matéria.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../components/Toast';
import { criarSala } from '../database/db';
import { spacing } from '../theme/theme';

export default function CriarSalaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const toast = useToast();
  const online = route.params?.online ? 1 : 0;

  const [nome, setNome] = useState('');
  const [confirma, setConfirma] = useState('');
  const [informacoes, setInformacoes] = useState('');
  const [erros, setErros] = useState({});
  const [criando, setCriando] = useState(false);

  async function criar() {
    const n = nome.trim();
    const novos = {};
    if (!n) novos.nome = 'Digite o nome da sala.';
    if (n && n !== confirma.trim()) novos.confirma = 'Os nomes não coincidem.';
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setCriando(true);
    const salaId = await criarSala(db, {
      nome: n,
      informacoes: informacoes.trim(),
      online,
    });
    toast('Sala criada com sucesso.');
    // Vai direto para a sala criada para começar a cadastrar os alunos.
    navigation.replace('Sala', { salaId });
  }

  return (
    <Screen avoidKeyboard>
      <TitleCard
        title="SALA NOVA"
        subtitle={online ? 'sala online' : 'sala presencial'}
        icon={online ? 'globe-outline' : 'easel-outline'}
      />

      <Field
        label="NOME DA SALA"
        icon="pricetag-outline"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          if (erros.nome) setErros((e) => ({ ...e, nome: undefined }));
        }}
        placeholder="Ex.: Algoritmos I"
        error={erros.nome}
      />
      <Field
        label="CONFIRME O NOME DA SALA"
        icon="checkmark-done-outline"
        value={confirma}
        onChangeText={(t) => {
          setConfirma(t);
          if (erros.confirma) setErros((e) => ({ ...e, confirma: undefined }));
        }}
        placeholder="Repita o nome da sala"
        error={erros.confirma}
      />
      <Field
        label="INFORMAÇÕES DA MATÉRIA"
        icon="document-text-outline"
        value={informacoes}
        onChangeText={setInformacoes}
        placeholder="Horários, período, observações..."
        multiline
      />

      <View style={styles.acao}>
        <PrimaryButton
          title="Criar sala"
          icon="add"
          onPress={criar}
          loading={criando}
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
