import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

import {
  getOrderItems,
  updateOrderStatus,
} from '../../../database/db';

import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import StatusDropdown from '../components/StatusDropdown';

import { kitchenStyles } from '../styles/kitchenStyles';

const StatusScreen = () => {
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
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id.toString()}
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