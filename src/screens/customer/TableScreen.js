import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import colors from '../../styles/Theme';
import { getActiveBillOrders, closeBillAndCheckout } from '../../database/db';
const STATUS_CONFIG = {
  pending: { label: '⏳ Pending', color: '#E65100', bgColor: '#FFF3E0' },
  cooking: { label: '🍳 Cooking', color: '#0288D1', bgColor: '#E1F5FE' },
  served: { label: '✅ Served', color: '#2E7D32', bgColor: '#E8F5E9' },
};
function ReceiptScreen({ navigation, route, orders: initialOrders, tables_id: propTableId, tables_number: propTableNum, onBack, onClearAllOrders }) {
  const db = useSQLiteContext();
  const tables_id = propTableId ?? route?.params?.tables_id;
  const tables_number = propTableNum ?? route?.params?.tables_number;
  const handleBack = onBack || (navigation?.canGoBack() ? () => navigation.goBack() : null);
  const [billId, setBillId] = useState(null);
  const [orders, setOrders] = useState(initialOrders || route?.params?.orders || []);
  const [loading, setLoading] = useState(true);
  const fetchOrders = useCallback(async () => {
    if (!db || !tables_id) return setLoading(false);
    try {
      const result = await getActiveBillOrders(db, tables_id);
      if (result) {
        if (result.billId || result.bill_id) setBillId(result.billId || result.bill_id);
        if (result.orders?.length) {
          setOrders(result.orders.map((order) => ({...order, items: (order.items || []).map((item) => ({...item,
              status: String(item.order_item_status || item.status || 'pending').toLowerCase(),
              name: item.name || item.menu_name || 'Menu List', price: item.price || 0, quantity: item.quantity || 1,
              note: item.note || item.order_item_note || '',})),
          })));
        }
      }
    } catch (error) {
      console.error('Failed to load bill orders:', error);
    } finally {
      setLoading(false);
    }
  }, [db, tables_id]);
  useFocusEffect(useCallback(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 3000);
    return () => clearInterval(timer);
  }, [fetchOrders]));
  const grandTotal = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const handleClear = () => {
    Alert.alert('Payment successful', 'Do you want to close this bill and clear the table?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK',onPress: async () => {
          try {
            const targetBillId = billId || orders[0]?.bill_id || orders[0]?.billId;
            if (!targetBillId || !tables_id) return Alert.alert('Error', 'ไม่พบข้อมูลบิลหรือหมายเลขโต๊ะ');
            await closeBillAndCheckout(db, targetBillId, tables_id);
            onClearAllOrders?.();
            setTimeout(() => navigation?.navigate ? navigation.navigate('Table') : handleBack?.(), 100);
          } catch (error) {
            Alert.alert('Error', `ไม่สามารถปิดบิลได้: ${error.message || 'เกิดข้อผิดพลาด'}`);
          }
        },
      },
    ]);
  };
  if (loading && !orders.length) {
    return (
      <View style={[styles.container, styles.centerBox]}>
        <ActivityIndicator size="large" color={colors.cyan} />
        <Text style={{ color: colors.dim, marginTop: 10 }}>Loading receipt...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {handleBack && (
          <TouchableOpacity onPress={handleBack} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: colors.cyan, fontWeight: '600' }}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Receipt {tables_number ? `(Table ${tables_number})` : ''}</Text>
        <Text style={styles.subtitle}>All ordered food items</Text>
      </View>
      {!orders.length ? (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 48, marginBottom: 10 }}>📄</Text>
          <Text style={{ fontSize: 16, color: colors.dim }}>Doesn't Have Order yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          {orders.map((order, index) => (
            <View key={order.orderId || order.order_id || index} style={styles.orderCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.boldText}>Round {order.round || index + 1} ({order.orderId || order.order_id || `#${index + 1}`})</Text>
                <Text style={styles.subtitle}>{order.date || ''}</Text>
              </View>
              <View style={styles.divider} />
              {order.items?.map((item, itemIdx) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                return (
                  <View key={item.order_item_id || itemIdx} style={{ marginVertical: 6 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.boldText, { flex: 1, fontSize: 14 }]}>{item.name} × {item.quantity}</Text>
                      <View style={[styles.badge, { backgroundColor: cfg.bgColor }]}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.color }}>{cfg.label}</Text>
                      </View>
                      <Text style={styles.boldText}>{(item.price * item.quantity) || 0} ฿</Text>
                    </View>
                    {!!item.note && <Text style={styles.itemNote}>📝 {item.note}</Text>}
                  </View>
                );
              })}
              <View style={styles.divider} />
              <View style={styles.rowBetween}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.dim }}>Round Total</Text>
                <Text style={[styles.boldText, { color: colors.cyan }]}>{order.totalAmount || 0} ฿</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {!!orders.length && (
        <View style={styles.footer}>
          <View style={[styles.rowBetween, { marginBottom: 14 }]}>
            <Text style={styles.boldText}>Total</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.cyan }}>{grandTotal} ฿</Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} activeOpacity={0.8} onPress={handleClear}>
            <Text style={{ color: colors.card, fontSize: 15, fontWeight: '700' }}>Check Bill & Close Table</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  boldText: { fontSize: 16, fontWeight: '700', color: colors.text },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.dim, marginTop: 2 },
  header: { paddingHorizontal: 24, paddingTop: 45, paddingBottom: 15 },
  orderList: { paddingHorizontal: 24, paddingBottom: 20, gap: 16 },
  orderCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  itemNote: { fontSize: 12, color: '#E65100', marginTop: 2, fontStyle: 'italic', paddingLeft: 4 },
  footer: { backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  clearBtn: { backgroundColor: colors.cyan, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
});
export default ReceiptScreen;
