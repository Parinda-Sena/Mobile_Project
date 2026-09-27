import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite'; // ใช้ useSQLiteContext แทน openDatabaseAsync
import { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    View,
} from 'react-native';

import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import { getOrderItems } from '../../database/db'; // นำเข้าจากโฟลเดอร์กลาง
import { kitchenStyles } from '../../styles/kitchenStyles';

const OrderListScreen = () => {
  const db = useSQLiteContext(); // ดึง db จาก Provider ส่วนกลาง
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      // ส่ง db เข้าไปในฟังก์ชันกลาง
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
    <View style={kitchenStyles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id?.toString()}
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
