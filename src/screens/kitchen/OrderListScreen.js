import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import { getOrderItems } from '../../database/db';

const OrderListScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getOrderItems(db);
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [db])
  );

  const refresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('KitchenHome')} activeOpacity={0.7}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>รายการที่ต้องทำ</Text>
        <Text style={styles.subtitle}>
          {orders.length > 0 ? `มีทั้งหมด ${orders.length} รายการ` : 'ไม่มีรายการค้าง'}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id?.toString()}
        renderItem={({ item }) => <OrderCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState text="ตอนนี้ยังไม่มีรายการที่ต้องทำ" />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#4E6C50" />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default OrderListScreen;
