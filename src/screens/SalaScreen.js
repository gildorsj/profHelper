// Menu de uma sala: ações disponíveis (alunos, chamada, tarefas, informações).
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import MenuButton from '../components/MenuButton';
import { getSala } from '../database/db';

export default function SalaScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const { salaId } = route.params;
  const [sala, setSala] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      getSala(db, salaId).then((s) => {
        if (ativo) {
          setSala(s);
          if (s) navigation.setOptions({ title: s.nome });
        }
      });
      return () => {
        ativo = false;
      };
    }, [db, salaId, navigation])
  );

  return (
    <Screen>
      <TitleCard
        title="SALA VIRTUAL"
        subtitle={sala ? sala.nome : '...'}
      />

      <MenuButton
        icon="person-add-outline"
        label="Adicionar aluno"
        onPress={() => navigation.navigate('AdicionarAluno', { salaId })}
      />
      <MenuButton
        icon="checkbox-outline"
        label="Registrar aula (chamada)"
        onPress={() => navigation.navigate('RegistrarAula', { salaId })}
      />
      <MenuButton
        icon="clipboard-outline"
        label="Adicionar tarefa"
        onPress={() => navigation.navigate('AdicionarTarefa', { salaId })}
      />
      <MenuButton
        icon="people-outline"
        label="Listagem de alunos"
        onPress={() => navigation.navigate('ListaAlunos', { salaId })}
      />
      <MenuButton
        icon="list-outline"
        label="Tarefas"
        onPress={() => navigation.navigate('ListaTarefas', { salaId })}
      />
      <MenuButton
        icon="person-remove-outline"
        label="Remover aluno"
        danger
        onPress={() => navigation.navigate('RemoverAluno', { salaId })}
      />
      <MenuButton
        icon="stats-chart-outline"
        label="Informações da sala"
        onPress={() => navigation.navigate('InfoSala', { salaId })}
      />
    </Screen>
  );
}
