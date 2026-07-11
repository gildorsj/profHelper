// Menu de uma sala: ações agrupadas por seção.
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import TitleCard from '../components/TitleCard';
import MenuButton from '../components/MenuButton';
import SectionLabel from '../components/SectionLabel';
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
        icon={sala && sala.online ? 'globe-outline' : 'easel-outline'}
      />

      <SectionLabel>Alunos</SectionLabel>
      <MenuButton
        icon="person-add-outline"
        label="Adicionar aluno"
        subtitle="Cadastrar novo aluno na sala"
        onPress={() => navigation.navigate('AdicionarAluno', { salaId })}
      />
      <MenuButton
        icon="people-outline"
        label="Listagem de alunos"
        subtitle="Ver a frequência de cada aluno"
        onPress={() => navigation.navigate('ListaAlunos', { salaId })}
      />
      <MenuButton
        icon="person-remove-outline"
        label="Remover aluno"
        subtitle="Excluir aluno da sala"
        danger
        onPress={() => navigation.navigate('RemoverAluno', { salaId })}
      />

      <SectionLabel>Aulas e frequência</SectionLabel>
      <MenuButton
        icon="checkbox-outline"
        label="Registrar aula (chamada)"
        subtitle="Marcar presenças e faltas"
        onPress={() => navigation.navigate('RegistrarAula', { salaId })}
      />
      <MenuButton
        icon="stats-chart-outline"
        label="Informações da sala"
        subtitle="Frequência geral e estatísticas"
        onPress={() => navigation.navigate('InfoSala', { salaId })}
      />

      <SectionLabel>Tarefas</SectionLabel>
      <MenuButton
        icon="clipboard-outline"
        label="Adicionar tarefa"
        subtitle="Criar nova atividade"
        onPress={() => navigation.navigate('AdicionarTarefa', { salaId })}
      />
      <MenuButton
        icon="list-outline"
        label="Tarefas"
        subtitle="Ver e concluir tarefas"
        onPress={() => navigation.navigate('ListaTarefas', { salaId })}
      />
    </Screen>
  );
}
