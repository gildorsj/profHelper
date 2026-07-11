// Lista de salas (presenciais ou online). Toque numa sala para abri-la.
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import TitleCard from '../components/TitleCard';
import EmptyState from '../components/EmptyState';
import { listarSalas } from '../database/db';
import { colors, radius, spacing, typography } from '../theme/theme';

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
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Sala', { salaId: item.id })}
      >
        <Ionicons
          name={online ? 'globe-outline' : 'easel-outline'}
          size={24}
          color={colors.onPrimary}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardSub}>
            {item.total_alunos} aluno(s)
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.onPrimaryMuted} />
      </TouchableOpacity>
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
          <TitleCard
            title="SALAS VIRTUAIS"
            subtitle={online ? 'online' : 'presenciais'}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="albums-outline"
            message={`Nenhuma sala ${online ? 'online ' : ''}cadastrada ainda.\nVolte e toque em "Criar sala".`}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    color: colors.onPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  cardSub: {
    color: colors.onPrimaryMuted,
    fontSize: typography.small,
    marginTop: 2,
  },
});
