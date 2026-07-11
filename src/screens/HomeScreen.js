// Tela inicial: cabeçalho do professor + menu principal.
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import MenuButton from '../components/MenuButton';
import { getProfessor } from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const [professor, setProfessor] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      getProfessor(db).then((p) => {
        if (ativo) setProfessor(p);
      });
      return () => {
        ativo = false;
      };
    }, [db])
  );

  return (
    <Screen>
      {/* Cabeçalho do professor (toque para editar) */}
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Perfil')}
      >
        <Avatar size={58} />
        <View style={styles.headerText}>
          <Text style={styles.nome}>
            Professor(a): {professor ? professor.nome : '...'}
          </Text>
          <Text style={styles.materia}>
            Matéria: {professor && professor.materia ? professor.materia : '—'}
          </Text>
        </View>
        <Ionicons name="create-outline" size={20} color={colors.onPrimaryMuted} />
      </TouchableOpacity>

      <View style={styles.menu}>
        <MenuButton
          icon="add-circle-outline"
          label="Criar sala"
          onPress={() => navigation.navigate('CriarSala', { online: 0 })}
        />
        <MenuButton
          icon="albums-outline"
          label="Salas existentes"
          onPress={() => navigation.navigate('ListaSalas', { online: 0 })}
        />
        <MenuButton
          icon="videocam-outline"
          label="Criar sala online"
          onPress={() => navigation.navigate('CriarSala', { online: 1 })}
        />
        <MenuButton
          icon="globe-outline"
          label="Salas online existentes"
          onPress={() => navigation.navigate('ListaSalas', { online: 1 })}
        />
        <MenuButton
          icon="person-circle-outline"
          label="Informações do professor"
          onPress={() => navigation.navigate('Perfil')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nome: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  materia: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
  menu: {
    marginTop: spacing.sm,
  },
});
