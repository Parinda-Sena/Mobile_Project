import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite'; // ใช้ Hook ตัวนี้แทนการเปิด Database เอง

import { getOrderItems, updateOrderStatus } from '../../database/db';

import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import StatusDropdown from '../../components/StatusDropdown';
import { kitchenStyles } from '../../styles/kitchenStyles';

const StatusScreen = () => {
  const db = useSQLiteContext(); // ดึง db จาก Provider ส่วนกลาง
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await getOrderItems(db); // ส่ง db เข้าไปในฟังก์ชันกลาง
      setOrders(data);
    } catch (error) {
      console.error('Load status error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [db])
  );

  const changeStatus = async (itemId, status) => {
    try {
      await updateOrderStatus(db, itemId, status); // ส่ง db เข้าไป
      await loadOrders();
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  return (
    <View style={kitchenStyles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_item_id?.toString()}
        renderItem={({ item }) => (
          <OrderCard item={item} showStatus={true}>
            <StatusDropdown
              value={item.order_item_status}
              onChange={(status) =>
                changeStatus(item.order_item_id, status)
              }
            />
          </OrderCard>
        )}
        ListEmptyComponent={<EmptyState text="ไม่มีรายการอาหาร" />}
      />
    </View>
  );
};

export default StatusScreen;
