import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import colors from '../../styles/Theme';
import { getActiveBillOrders, closeBillAndCheckout } from '../../database/db';

const STATUS_CONFIG = {
  pending: { label: '⏳ รอคิว', color: '#E65100', bgColor: '#FFF3E0' },
  cooking: { label: '🍳 กำลังปรุง', color: '#0288D1', bgColor: '#E1F5FE' },
  served: { label: '✅ เสิร์ฟแล้ว', color: '#2E7D32', bgColor: '#E8F5E9' },
  cancel: { label: '❌ ยกเลิก', color: '#C62828', bgColor: '#FFEBEE' },
};

function ReceiptScreen(props) {
  const db = useSQLiteContext();

  const navigation = props.navigation;
  const tables_id = props.tables_id ?? props.route?.params?.tables_id;
  const tables_number = props.tables_number ?? props.route?.params?.tables_number;
  const onClearAllOrders = props.onClearAllOrders || props.route?.params?.onClearAllOrders;

  const handleBack = props.onBack || props.route?.params?.onBack || (navigation?.canGoBack() ? () => navigation.goBack() : null);

  const [billId, setBillId] = useState(null);
  const [orders, setOrders] = useState(props.orders || props.route?.params?.orders || []);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (isInitial = false) => {
    if (!tables_id) {
      if (isInitial) setLoading(false);
      return;
    }
    try {
      if (isInitial && orders.length === 0) setLoading(true);
      const result = await getActiveBillOrders(db, tables_id);

      if (result) {
        if (result.billId || result.bill_id) {
          setBillId(result.billId || result.bill_id);
        }
        
        if (result.orders && Array.isArray(result.orders) && result.orders.length > 0) {
          const normalizedOrders = result.orders.map((order) => ({
            ...order,
            items: (order.items || []).map((item) => ({
              ...item,
              status: String(item.order_item_status || item.status || 'pending').toLowerCase(),
              name: item.name || item.menu_name || 'รายการอาหาร',
              price: item.price || 0,
              quantity: item.quantity || 1,
            })),
          }));

          setOrders(normalizedOrders);
        }
      }
    } catch (error) {
      console.error('Failed to load bill orders:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [db, tables_id]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders(true);
      const timer = setInterval(() => {
        fetchOrders(false);
      }, 3000);

      return () => clearInterval(timer);
    }, [fetchOrders])
  );

  const grandTotal = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const handleClear = () => {
    Alert.alert('Payment successful', 'Do you want to close this bill and clear the table?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const targetBillId = billId || orders[0]?.bill_id || orders[0]?.billId;

            if (targetBillId) {
              await closeBillAndCheckout(db, targetBillId, tables_id);
            }

            if (onClearAllOrders) {
              onClearAllOrders();
            }

            setTimeout(() => {
              if (navigation?.navigate) {
                navigation.navigate('Table', {
                  currentTable: { tables_id, tables_number },
                });
              } else if (handleBack) {
                handleBack();
              }
            }, 100);

          } catch (error) {
            console.error('Check Bill error detail:', error);
            setTimeout(() => {
              Alert.alert('Error', `ไม่สามารถปิดบิลได้: ${error.message || 'เกิดข้อผิดพลาด'}`);
            }, 100);
          }
        },
      },
    ]);
  };

  if (loading && orders.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.cyan} />
        <Text style={{ color: colors.dim, marginTop: 10 }}>Loading receipt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {handleBack && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}> ‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Receipt {tables_number ? `(Table ${tables_number})` : ''}</Text>
        <Text style={styles.subtitle}>All ordered food items</Text>
      </View>

      {/* Orders List / Empty State */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>Doesn't Have Order yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          {orders.map((order, index) => (
            <View key={order.orderId || order.order_id || index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Round {order.round || index + 1} ({order.orderId || order.order_id || `#${index + 1}`})</Text>
                <Text style={styles.orderDate}>{order.date || ''}</Text>
              </View>
              <View style={styles.divider} />
              
              {order.items?.map((item, itemIdx) => {
                const currentStatus = (item.status || 'pending').toLowerCase();
                const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;

                return (
                  <View key={item.order_item_id || itemIdx} style={styles.itemContainer}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        {item.name} × {item.quantity}
                      </Text>
                      
                      <View style={[styles.statusBadge, { backgroundColor: statusCfg.bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
                          {statusCfg.label}
                        </Text>
                      </View>

                      <Text style={styles.itemPrice}>{(item.price * item.quantity) || 0} ฿</Text>
                    </View>

                    {!!item.note && (
                      <Text style={styles.itemNote}>
                        📝 {item.note}
                      </Text>
                    )}
                  </View>
                );
              })}

              <View style={styles.divider} />
              <View style={styles.orderTotalRow}>
                <Text style={styles.orderTotalTitle}>Round Total</Text>
                <Text style={styles.orderTotalPrice}>{order.totalAmount || 0} ฿</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Footer */}
      {orders.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalTitle}>Total</Text>
            <Text style={styles.grandTotalPrice}>{grandTotal} ฿</Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} activeOpacity={0.8} onPress={handleClear}>
            <Text style={styles.clearBtnText}>Check Bill & Close Table</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 24, paddingTop: 45, paddingBottom: 15 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: colors.cyan, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 2 },
  scrollArea: { flex: 1 },
  orderList: { paddingHorizontal: 24, paddingBottom: 20, gap: 16 },
  orderCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: '700', color: colors.text },
  orderDate: { fontSize: 13, color: colors.dim },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  itemContainer: { marginVertical: 6 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  itemPrice: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemNote: { fontSize: 12, color: '#E65100', marginTop: 2, fontStyle: 'italic', paddingLeft: 4 },
  orderTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotalTitle: { fontSize: 14, fontWeight: '600', color: colors.dim },
  orderTotalPrice: { fontSize: 16, fontWeight: '700', color: colors.cyan },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: colors.dim },
  footer: { backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  grandTotalTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  grandTotalPrice: { fontSize: 22, fontWeight: '700', color: colors.cyan },
  clearBtn: { backgroundColor: colors.cyan, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  clearBtnText: { color: colors.card, fontSize: 15, fontWeight: '700' },
});

export default ReceiptScreen;