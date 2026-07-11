// Tela inicial: cabeçalho do professor + painel de resumo + menu principal.
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import Screen from '../components/Screen';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import MenuButton from '../components/MenuButton';
import SectionLabel from '../components/SectionLabel';
import { getProfessor, resumoGeral } from '../database/db';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const [professor, setProfessor] = useState(null);
  const [resumo, setResumo] = useState({
    totalSalasPresenciais: 0,
    totalSalasOnline: 0,
    totalAlunos: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([getProfessor(db), resumoGeral(db)]).then(([p, r]) => {
        if (ativo) {
          setProfessor(p);
          setResumo(r);
        }
      });
      return () => {
        ativo = false;
      };
    }, [db])
  );

  return (
    <Screen>
      {/* Cabeçalho do professor (toque para editar) */}
      <Pressable
        onPress={() => navigation.navigate('Perfil')}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="button"
        accessibilityLabel="Editar informações do professor"
      >
        <Card style={styles.header}>
          <Avatar size={54} />
          <View style={styles.headerText}>
            <Text style={styles.saudacao}>Bem-vindo(a),</Text>
            <Text style={styles.nome} numberOfLines={1}>
              {professor ? professor.nome : '...'}
            </Text>
            <Text style={styles.materia} numberOfLines={1}>
              {professor && professor.materia ? professor.materia : 'Toque para editar'}
            </Text>
          </View>
          <Ionicons name="create-outline" size={20} color={colors.onPrimaryMuted} />
        </Card>
      </Pressable>

      {/* Painel de resumo */}
      <View style={styles.stats}>
        <StatTile
          icon="easel-outline"
          valor={resumo.totalSalasPresenciais}
          rotulo="Presenciais"
        />
        <StatTile
          icon="globe-outline"
          valor={resumo.totalSalasOnline}
          rotulo="Online"
        />
        <StatTile
          icon="people-outline"
          valor={resumo.totalAlunos}
          rotulo="Alunos"
        />
      </View>

      <SectionLabel>Menu</SectionLabel>
      <MenuButton
        icon="add-circle-outline"
        label="Criar sala"
        subtitle="Nova turma presencial"
        onPress={() => navigation.navigate('CriarSala', { online: 0 })}
      />
      <MenuButton
        icon="albums-outline"
        label="Salas existentes"
        subtitle="Turmas presenciais"
        onPress={() => navigation.navigate('ListaSalas', { online: 0 })}
      />
      <MenuButton
        icon="videocam-outline"
        label="Criar sala online"
        subtitle="Nova turma a distância"
        onPress={() => navigation.navigate('CriarSala', { online: 1 })}
      />
      <MenuButton
        icon="globe-outline"
        label="Salas online existentes"
        subtitle="Turmas a distância"
        onPress={() => navigation.navigate('ListaSalas', { online: 1 })}
      />
      <MenuButton
        icon="person-circle-outline"
        label="Informações do professor"
        subtitle="Editar nome e matéria"
        onPress={() => navigation.navigate('Perfil')}
      />
    </Screen>
  );
}

function StatTile({ icon, valor, rotulo }) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={20} color={colors.onPrimary} />
      <Text style={styles.tileValor}>{valor}</Text>
      <Text style={styles.tileRotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  saudacao: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
  },
  nome: {
    color: colors.onPrimary,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  materia: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  tileValor: {
    color: colors.onPrimary,
    fontSize: typography.title,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  tileRotulo: {
    color: colors.onPrimaryFaint,
    fontSize: typography.tiny,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
