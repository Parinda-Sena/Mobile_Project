import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getOrderItems, updateOrderStatus } from '../../database/db';
import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import StatusDropdown from '../../components/StatusDropdown';
import { kitchenStyles } from '../../styles/kitchenStyles';

const StatusScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getOrderItems(db);
      setOrders(data);
    } catch (error) {
      console.error('Load status error:', error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
      const timer = setInterval(() => {
        loadOrders();
      }, 3000);
      return () => clearInterval(timer);
    }, [loadOrders])
  );

  const changeStatus = async (itemId, status) => {
    try {
      await updateOrderStatus(db, itemId, status);
      await loadOrders();
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  return (
    <View style={kitchenStyles.container}>
      <TouchableOpacity style={kitchenStyles.backBtn} onPress={() => navigation.navigate('KitchenHome')} activeOpacity={0.7}>
        <Text style={kitchenStyles.backText}>‹ Back</Text>
      </TouchableOpacity> 

      <FlatList
        style={kitchenStyles.list}
        data={orders}
        keyExtractor={(item) => item.order_item_id?.toString()}
        renderItem={({ item }) => (
          <OrderCard item={item} showStatus={true}>
            <StatusDropdown value={item.order_item_status} onChange={(status) => changeStatus(item.order_item_id, status)} />
          </OrderCard>
        )}
        ListEmptyComponent={<EmptyState text="ไม่มีรายการอาหาร" />}
      />
    </View>
  );
};

export default StatusScreen;
