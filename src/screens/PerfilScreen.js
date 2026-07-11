// Informações do professor: editar nome e matéria.
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import Field from '../components/Field';
import PrimaryButton from '../components/PrimaryButton';
import { getProfessor, salvarProfessor } from '../database/db';
import { spacing } from '../theme/theme';

export default function PerfilScreen({ navigation }) {
  const db = useSQLiteContext();
  const [nome, setNome] = useState('');
  const [materia, setMateria] = useState('');

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
      Alert.alert('Atenção', 'Informe o nome do professor.');
      return;
    }
    await salvarProfessor(db, { nome: nome.trim(), materia: materia.trim() });
    Alert.alert('Pronto', 'Informações salvas com sucesso.');
    navigation.goBack();
  }

  return (
    <Screen>
      <View style={styles.avatar}>
        <Avatar size={90} />
      </View>

      <Field
        label="NOME DO PROFESSOR"
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />
      <Field
        label="MATÉRIA"
        value={materia}
        onChangeText={setMateria}
        placeholder="Digite a matéria"
      />

      <View style={styles.acao}>
        <PrimaryButton title="salvar" onPress={salvar} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  acao: {
    marginTop: spacing.md,
  },
});
