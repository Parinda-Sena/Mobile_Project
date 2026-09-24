import  { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import { kitchenStyles } from '../styles/kitchenStyles';
import { getPendingOrderItems } from '../../../database/db';

const OrderListScreen = () => {
  const db = useSQLiteContext();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getPendingOrderItems(db);
      setOrders(data);
    } catch (error) {
      console.error('Load orders error:', error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
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
        keyExtractor={(item) => item.order_item_id.toString()}
        renderItem={({ item }) => <OrderCard item={item} />}
        ListEmptyComponent={
          <EmptyState text="ตอนนี้ยังไม่มีรายการที่ต้องทำ" />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
    </View>
  );
};

export default OrderListScreen;