// ---------------------------------------------------------------------------
// ProfHelper — Gerenciador de turmas para professores
// Ponto de entrada: banco (SQLite) + navegação (React Navigation / stack).
// ---------------------------------------------------------------------------
import { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from './src/database/db';
import { colors } from './src/theme/theme';

import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import CriarSalaScreen from './src/screens/CriarSalaScreen';
import ListaSalasScreen from './src/screens/ListaSalasScreen';
import SalaScreen from './src/screens/SalaScreen';
import AdicionarAlunoScreen from './src/screens/AdicionarAlunoScreen';
import ListaAlunosScreen from './src/screens/ListaAlunosScreen';
import RemoverAlunoScreen from './src/screens/RemoverAlunoScreen';
import RegistrarAulaScreen from './src/screens/RegistrarAulaScreen';
import AdicionarTarefaScreen from './src/screens/AdicionarTarefaScreen';
import ListaTarefasScreen from './src/screens/ListaTarefasScreen';
import InfoSalaScreen from './src/screens/InfoSalaScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primaryDark },
  headerTintColor: colors.onPrimary,
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.primary },
};

function Carregando() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.onPrimary} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Suspense fallback={<Carregando />}>
        <SQLiteProvider
          databaseName="profhelper.db"
          onInit={initDatabase}
          useSuspense
        >
          <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'ProfHelper' }}
              />
              <Stack.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{ title: 'Informações do professor' }}
              />
              <Stack.Screen
                name="CriarSala"
                component={CriarSalaScreen}
                options={{ title: 'Sala nova' }}
              />
              <Stack.Screen
                name="ListaSalas"
                component={ListaSalasScreen}
                options={{ title: 'Salas' }}
              />
              <Stack.Screen
                name="Sala"
                component={SalaScreen}
                options={{ title: 'Sala' }}
              />
              <Stack.Screen
                name="AdicionarAluno"
                component={AdicionarAlunoScreen}
                options={{ title: 'Adicionar aluno' }}
              />
              <Stack.Screen
                name="ListaAlunos"
                component={ListaAlunosScreen}
                options={{ title: 'Lista de alunos' }}
              />
              <Stack.Screen
                name="RemoverAluno"
                component={RemoverAlunoScreen}
                options={{ title: 'Remover aluno' }}
              />
              <Stack.Screen
                name="RegistrarAula"
                component={RegistrarAulaScreen}
                options={{ title: 'Registrar aula' }}
              />
              <Stack.Screen
                name="AdicionarTarefa"
                component={AdicionarTarefaScreen}
                options={{ title: 'Adicionar tarefa' }}
              />
              <Stack.Screen
                name="ListaTarefas"
                component={ListaTarefasScreen}
                options={{ title: 'Tarefas' }}
              />
              <Stack.Screen
                name="InfoSala"
                component={InfoSalaScreen}
                options={{ title: 'Informações da sala' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
