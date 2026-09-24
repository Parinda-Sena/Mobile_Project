import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    View,
} from 'react-native';

import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import { getOrderItems } from '../db/database';

import { kitchenStyles } from '../styles/kitchenStyles';

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