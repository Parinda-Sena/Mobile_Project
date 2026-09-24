import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    FlatList,
    View,
} from 'react-native';

import {
    getOrderItems,
    updateOrderStatus,
} from '../db/database';

import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import StatusDropdown from '../components/StatusDropdown';

import { kitchenStyles } from '../styles/kitchenStyles';

const StatusScreen = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await getOrderItems();
      setOrders(data);
    } catch (error) {
      console.error('Load status error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const changeStatus = async (itemId, status) => {
    try {
      await updateOrderStatus(itemId, status);
      await loadOrders();
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  return (
    <View style={kitchenStyles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id}
        renderItem={({ item }) => (
          <OrderCard
            item={item}
            showStatus={true}
          >
            <StatusDropdown
              value={item.order_item_status}
              onChange={(status) =>
                changeStatus(
                  item.order_item_id,
                  status
                )
              }
            />
          </OrderCard>
        )}
        ListEmptyComponent={
          <EmptyState text="ไม่มีรายการอาหาร" />
        }
      />
    </View>
  );
};

export default StatusScreen;