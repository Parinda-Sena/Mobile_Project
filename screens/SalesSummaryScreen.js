import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    FlatList,
    Text,
    View,
} from 'react-native';

import {
    getSalesSummary,
    getSoldMenuSummary,
} from '../db/database';

import { salesStyles } from '../styles/salesStyles';

const SalesSummaryScreen = () => {
  const [summary, setSummary] = useState({
    closed_bills: 0,
    total_sales: 0,
    sold_items: 0,
  });

  const [menus, setMenus] = useState([]);

  const loadSales = async () => {
    try {
      const summaryData = await getSalesSummary();
      const menuData = await getSoldMenuSummary();

      setSummary(summaryData);
      setMenus(menuData);
    } catch (error) {
      console.error('Sales summary error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSales();
    }, [])
  );

  return (
    <View style={salesStyles.container}>

      <FlatList
        data={menus}
        keyExtractor={(item) => item.menu_id}
        ListHeaderComponent={
          <>
            <Text style={salesStyles.title}>
              สรุปยอดขาย
            </Text>

            <View style={salesStyles.summaryCard}>
              <Text style={salesStyles.summaryLabel}>
                จำนวนบิลที่ปิดแล้ว
              </Text>

              <Text style={salesStyles.summaryValue}>
                {summary.closed_bills} บิล
              </Text>
            </View>

            <View style={salesStyles.summaryCard}>
              <Text style={salesStyles.summaryLabel}>
                ยอดขายรวม
              </Text>

              <Text style={salesStyles.summaryValue}>
                {summary.total_sales} บาท
              </Text>
            </View>

            <View style={salesStyles.summaryCard}>
              <Text style={salesStyles.summaryLabel}>
                จำนวนอาหารที่ขาย
              </Text>

              <Text style={salesStyles.summaryValue}>
                {summary.sold_items} รายการ
              </Text>
            </View>

            <Text style={salesStyles.sectionTitle}>
              รายการอาหารที่ขาย
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={salesStyles.menuCard}>
            <Text style={salesStyles.menuName}>
              {item.menu_name}
            </Text>

            <Text style={salesStyles.menuDetail}>
              จำนวน {item.quantity} รายการ
            </Text>

            <Text style={salesStyles.menuDetail}>
              ยอดรวม {item.total} บาท
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={salesStyles.menuDetail}>
            ยังไม่มีข้อมูลยอดขาย
          </Text>
        }
      />

    </View>
  );
};

export default SalesSummaryScreen;