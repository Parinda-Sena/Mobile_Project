import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    View,
} from 'react-native';

import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import { DATABASE_NAME } from '../db/database';
import { kitchenStyles } from '../styles/kitchenStyles';

// เขียนฟังก์ชัน Query ข้อมูลไว้ในหน้า Screen นี้ได้เลย
const getOrderItems = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    const query = `
      SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.menu_id,
        oi.quantity,
        oi.note,
        oi.order_item_status,
        oi.order_item_price,
        m.name AS menu_name,
        t.tables_number,
        o.ordered_at
      FROM order_item oi
      JOIN menu m ON oi.menu_id = m.menu_id
      JOIN orders o ON oi.order_id = o.order_id
      JOIN bills b ON o.bills_id = b.bills_id
      JOIN tables t ON b.tables_id = t.tables_id
      ORDER BY o.ordered_at DESC;
    `;
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.error('Error fetching order items:', error);
    return [];
  }
};

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getOrderItems();
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const refresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  return (
    <View style={kitchenStyles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id}
        renderItem={({ item }) => (
          <OrderCard item={item} />
        )}
        ListEmptyComponent={
          <EmptyState text="ตอนนี้ยังไม่มีรายการที่ต้องทำ" />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
      />
    </View>
  );
};

export default OrderListScreen;