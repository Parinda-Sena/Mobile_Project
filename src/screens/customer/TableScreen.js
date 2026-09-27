
import React, { useEffect, useState } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ActivityIndicator,ScrollView,} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import colors from '../../styles/Theme';
import { getTables } from '../../database/db';

function TableScreen({ navigation }) {
  const db = useSQLiteContext();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTables = async () => {
    try {
      const result = await getTables(db);
      setTables(result);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleSelectTable = (table) => {
    navigation.navigate('Home', {
      tables_id: table.tables_id,
      tables_number: table.tables_number,
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.icon}>🪑</Text>

        <Text style={styles.title}>
          Select Your Table
        </Text>

        <Text style={styles.subtitle}>
          Please select your table before ordering
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.cyan}
          style={styles.loading}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.tableContainer}
          showsVerticalScrollIndicator={false}
        >
          {tables.map((table) => {
            const isAvailable =
              table.tables_status === 'available';

            return (
              <TouchableOpacity
                key={table.tables_id}
                style={[
                  styles.tableCard,
                  !isAvailable && styles.unavailableCard,
                ]}
                activeOpacity={isAvailable ? 0.7 : 1}
                disabled={!isAvailable}
                onPress={() => handleSelectTable(table)}
              >
                <Text style={styles.tableIcon}>
                  🪑
                </Text>

                <Text
                  style={[
                    styles.tableNumber,
                    !isAvailable && styles.unavailableText,
                  ]}
                >
                  Table {table.tables_number}
                </Text>

                <Text
                  style={[
                    styles.statusText,
                    !isAvailable && styles.unavailableText,
                  ]}
                >
                  {isAvailable ? 'Available' : 'unavailable'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: 'center',
  },

  icon: {
    fontSize: 42,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: colors.dim,
    marginTop: 6,
    textAlign: 'center',
  },

  loading: {
    marginTop: 50,
  },

  tableContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },

  tableCard: {
    width: '47%',
    minHeight: 125,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },

  unavailableCard: {
    opacity: 0.45,
  },

  tableIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  tableNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  statusText: {
    fontSize: 13,
    color: colors.cyan,
    marginTop: 5,
    fontWeight: '600',
  },

  unavailableText: {
    color: colors.dim,
  },
});

export default TableScreen;
