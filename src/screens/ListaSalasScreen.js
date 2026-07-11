// Lista de salas (presenciais ou online). Toque numa sala para abri-la.
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import SectionLabel from '../components/SectionLabel';
import { listarSalas } from '../database/db';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export default function ListaSalasScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const online = route.params?.online ? 1 : 0;
  const [salas, setSalas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarSalas(db, online).then((rows) => {
        if (ativo) setSalas(rows);
      });
      return () => {
        ativo = false;
      };
    }, [db, online])
  );

  function renderSala({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Sala', { salaId: item.id })}
        accessibilityRole="button"
        accessibilityLabel={`Abrir sala ${item.nome}`}
      >
        <View style={styles.iconChip}>
          <Ionicons
            name={online ? 'globe-outline' : 'easel-outline'}
            size={20}
            color={colors.onPrimary}
          />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.nome}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={13} color={colors.onPrimaryMuted} />
            <Text style={styles.cardSub}>{item.total_alunos} aluno(s)</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.onPrimaryFaint} />
      </Pressable>
    );
  }

  return (
    <View style={styles.bg}>
      <FlatList
        data={salas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSala}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <TitleCard
              title="SALAS VIRTUAIS"
              subtitle={online ? 'online' : 'presenciais'}
              icon={online ? 'globe-outline' : 'easel-outline'}
            />
            <View style={styles.acao}>
              <PrimaryButton
                title={online ? 'Criar sala online' : 'Criar sala'}
                icon="add"
                variant="ghost"
                full
                onPress={() => navigation.navigate('CriarSala', { online })}
              />
            </View>
            {salas.length > 0 ? (
              <SectionLabel>{salas.length} sala(s)</SectionLabel>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="albums-outline"
            message={`Nenhuma sala ${online ? 'online ' : ''}cadastrada ainda.`}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.md,
    flexGrow: 1,
  },
  acao: {
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  pressed: {
    opacity: 0.82,
    backgroundColor: colors.cardStrong,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.cardStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  cardSub: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginLeft: 4,
  },
});
