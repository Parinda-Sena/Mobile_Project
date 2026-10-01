import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../styles/Theme';
import { getTables } from '../../database/db';

function TableScreen({ navigation }) {
  const db = useSQLiteContext();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadTables = useCallback(async () => {
    try {
      const result = await getTables(db);
      setTables(result || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  }, [db]);
  useFocusEffect(useCallback(() => { loadTables(); }, [loadTables]));
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.staffButton} 
          onPress={() => navigation.navigate('Login', { from: 'Table' })} activeOpacity={0.7} >
          <Text style={{ fontSize: 26, color: colors.text }}>☰</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 42, marginBottom: 8 }}>🪑</Text>
        <Text style={styles.title}>Select Your Table</Text>
        <Text style={styles.subtitle}>Please select your table before ordering</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.cyan} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.tableContainer} showsVerticalScrollIndicator={false}>
          {tables.map((table) => {
            const isAvailable = table.tables_status === 'available';
            const themeColor = isAvailable ? '#698269' : '#d9534f';
            return (
              <TouchableOpacity
                key={table.tables_id}
                style={[ styles.tableCard, { backgroundColor: isAvailable ? '#E8F5E9' : '#FFEBEE', borderColor: themeColor },
                ]}
                activeOpacity={0.7} onPress={() => navigation.navigate('Home', { tables_id: table.tables_id, tables_number: table.tables_number })} >
                <Text style={[styles.tableNumber, { color: themeColor }]}> Table {table.tables_number} </Text>
                <View style={[styles.statusBadge, { backgroundColor: isAvailable ? '#C8E6C9' : '#FFCDD2' }]}>
                  <Text style={[styles.statusText, { color: themeColor }]}> ● {isAvailable ? 'Available' : 'Occupied'} </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 55, paddingBottom: 15, alignItems: 'center', position: 'relative' },
  staffButton: { position: 'absolute', right: 24, top: 55, zIndex: 10, padding: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 6, textAlign: 'center' },
    tableContainer: { paddingHorizontal: 24, paddingBottom: 30, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  tableCard: { width: '47%', minHeight: 110, borderRadius: 18, borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 15 },
  tableNumber: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 13, fontWeight: '700' },
});

export default TableScreen;
