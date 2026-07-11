// Informações do professor: editar nome e matéria.
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../components/Toast';
import { getProfessor, salvarProfessor } from '../database/db';
import { spacing } from '../theme/theme';

export default function PerfilScreen({ navigation }) {
  const db = useSQLiteContext();
  const toast = useToast();
  const [nome, setNome] = useState('');
  const [materia, setMateria] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      getProfessor(db).then((p) => {
        if (ativo && p) {
          setNome(p.nome || '');
          setMateria(p.materia || '');
        }
      });
      return () => {
        ativo = false;
      };
    }, [db])
  );

  async function salvar() {
    if (!nome.trim()) {
      setErro('Informe o nome do professor.');
      return;
    }
    setErro('');
    setSalvando(true);
    await salvarProfessor(db, { nome: nome.trim(), materia: materia.trim() });
    setSalvando(false);
    toast('Informações salvas com sucesso.');
    navigation.goBack();
  }

  return (
    <Screen avoidKeyboard>
      <View style={styles.avatar}>
        <Avatar size={92} />
      </View>

      <Field
        label="NOME DO PROFESSOR"
        icon="person-outline"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          if (erro) setErro('');
        }}
        placeholder="Digite o nome"
        error={erro}
      />
      <Field
        label="MATÉRIA"
        icon="book-outline"
        value={materia}
        onChangeText={setMateria}
        placeholder="Digite a matéria"
      />

      <View style={styles.acao}>
        <PrimaryButton
          title="Salvar"
          icon="checkmark"
          onPress={salvar}
          loading={salvando}
          full
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  acao: {
    marginTop: spacing.md,
  },
});
