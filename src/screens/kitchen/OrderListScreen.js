import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import { getOrderItems } from '../../database/db';
import { kitchenStyles } from '../../styles/kitchenStyles';

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
  <View style={kitchenStyles.container}>

    <TouchableOpacity
      style={kitchenStyles.backBtn}
      onPress={() => navigation.navigate('KitchenHome')}
      activeOpacity={0.7}
    >
      <Text style={kitchenStyles.backText}>‹ Back</Text>
    </TouchableOpacity>

    <FlatList
      style={kitchenStyles.list}
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