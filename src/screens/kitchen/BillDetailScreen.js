import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { colors } from '../../styles/Theme';

const BillDetailScreen = ({ navigation, route }) => {
  const db = useSQLiteContext();
  const { billId } = route.params;

  const [bill, setBill] = useState(null);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const loadBillDetail = async () => {
    try {
      const billData = await db.getFirstAsync(
        `
        SELECT
          b.bills_id,
          b.opened_at,
          b.closed_at,
          t.tables_number
        FROM bills b
        JOIN tables t
          ON b.tables_id = t.tables_id
        WHERE b.bills_id = ?
        `,
        [billId]
      );

      const orderData = await db.getAllAsync(
        `
        SELECT
          order_id,
          round,
          ordered_at
        FROM orders
        WHERE bills_id = ?
        ORDER BY round ASC
        `,
        [billId]
      );

      const ordersWithItems = [];
      let billTotal = 0;

      for (const order of orderData) {
        const items = await db.getAllAsync(
          `
          SELECT
            oi.order_item_id,
            oi.quantity,
            oi.order_item_price AS price,
            oi.note,
            oi.order_item_status,
            m.name
          FROM order_item oi
          JOIN menu m
            ON oi.menu_id = m.menu_id
          WHERE oi.order_id = ?
          ORDER BY oi.order_item_id
          `,
          [order.order_id]
        );

        for (const item of items) {
          if (item.order_item_status !== 'cancel') {
            billTotal += item.quantity * item.price;
          }
        }

        ordersWithItems.push({
          ...order,
          items,
        });
      }

      setBill(billData);
      setOrders(ordersWithItems);
      setTotal(billTotal);
    } catch (error) {
      console.error('Bill detail error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBillDetail();
    }, [db, billId])
  );

  const formatTime = (dateTime) => {
    if (!dateTime) {
      return '-';
    }

    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!bill) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('SalesSummary')}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            ไม่พบข้อมูลบิล
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('SalesSummary')}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>
          รายละเอียดบิล
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            โต๊ะ {bill.tables_number}
          </Text>

          <Text style={styles.infoText}>
            เวลาเปิดบิล {formatTime(bill.opened_at)}
          </Text>

          <Text style={styles.infoText}>
            เวลาปิดบิล {formatTime(bill.closed_at)}
          </Text>
        </View>

        {orders.map((order) => (
          <View
            key={order.order_id}
            style={styles.orderCard}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.roundText}>
                รอบที่ {order.round}
              </Text>

              <Text style={styles.orderTime}>
                {formatTime(order.ordered_at)}
              </Text>
            </View>

            {order.items.map((item) => {
              const itemTotal = item.quantity * item.price;
              const isCancel = item.order_item_status === 'cancel';

              return (
                <View
                  key={item.order_item_id}
                  style={styles.itemRow}
                >
                  <View style={styles.itemInfo}>
                    <Text
                      style={[
                        styles.itemName,
                        isCancel && styles.cancelText,
                      ]}
                    >
                      {item.name}
                    </Text>

                    <Text style={styles.itemDetail}>
                      {item.quantity} x {item.price} บาท
                    </Text>

                    {item.note ? (
                      <Text style={styles.note}>
                        หมายเหตุ: {item.note}
                      </Text>
                    ) : null}

                    {isCancel ? (
                      <Text style={styles.cancelText}>
                        ยกเลิก
                      </Text>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.itemTotal,
                      isCancel && styles.cancelText,
                    ]}
                  >
                    {itemTotal} บาท
                  </Text>
                </View>
              );
            })}
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            ยอดรวมทั้งหมด
          </Text>

          <Text style={styles.totalValue}>
            {total} บาท
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    paddingTop: 50,
  },

  backBtn: {
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingTop: 8,
  },

  backText: {
    fontSize: 18,
    color: colors.text,
  },

  list: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  infoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
  },

  orderCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  roundText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  orderTime: {
    fontSize: 13,
    color: colors.dim,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },

  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  itemDetail: {
    fontSize: 13,
    color: colors.dim,
    marginTop: 3,
  },

  note: {
    fontSize: 13,
    color: colors.dim,
    marginTop: 4,
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },

  cancelText: {
    color: colors.red,
  },

  totalCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    marginTop: 4,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },

  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: colors.dim,
  },
});

export default BillDetailScreen;