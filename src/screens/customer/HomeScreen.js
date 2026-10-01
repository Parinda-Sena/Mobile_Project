import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import colors from '../../styles/Theme';
import { getActiveBillOrders, closeBillAndCheckout } from '../../database/db';

const STATUS_CONFIG = {
  pending: { label: '⏳ Pending', color: '#E65100', bgColor: '#FFF3E0', next: 'cooking' },
  cooking: { label: '🍳 Cooking', color: '#0288D1', bgColor: '#E1F5FE', next: 'served' },
  served: { label: '✅ Served', color: '#2E7D32', bgColor: '#E8F5E9', next: 'cancel' },
  cancel: { label: '❌ Cancelled', color: '#C62828', bgColor: '#FFEBEE', next: 'pending' },
};

function ReceiptScreen(props) {
  const db = useSQLiteContext();
  const navigation = props.navigation;
  const tables_id = props.tables_id ?? props.route?.params?.tables_id;
  const tables_number = props.tables_number ?? props.route?.params?.tables_number;
  const handleBack = props.onBack || (navigation?.canGoBack() ? () => navigation.goBack() : null);
  const [billId, setBillId] = useState(null);
  const [orders, setOrders] = useState(props.orders || props.route?.params?.orders || []);
  const [loading, setLoading] = useState(true);

  // อัปเดต orders เมื่อได้รับ props/params ใหม่
  useEffect(() => {
    const passedOrders = props.orders || props.route?.params?.orders;
    if (passedOrders && Array.isArray(passedOrders) && passedOrders.length > 0) {
      setOrders(passedOrders);
    }
  }, [props.orders, props.route?.params?.orders]);

  const fetchOrders = useCallback(async (isInitial = false) => {
    if (!tables_id) return isInitial && setLoading(false);
    try {
      if (isInitial && orders.length === 0) setLoading(true);
      const result = await getActiveBillOrders(db, tables_id);
      if (result) {
        if (result.billId || result.bill_id) setBillId(result.billId || result.bill_id);
        if (Array.isArray(result.orders) && result.orders.length > 0) {
          setOrders(result.orders.map((order) => ({
            ...order,
            items: (order.items || []).map((item) => {
              // เช็คคอลัมน์ note ทุกชื่อที่เป็นไปได้จาก DB/Props
              const itemNote = item.note || item.order_item_note || item.item_note || item.remark || '';
              const itemStatus = String(item.order_item_status || item.status || 'pending').toLowerCase();
              return {
                ...item,
                status: itemStatus,
                name: item.name || item.menu_name || 'Menu List',
                price: item.price || 0,
                quantity: item.quantity || 1,
                note: itemNote,
              };
            }),
          })));
        }
      }
    } catch (error) {
      console.error('Failed to load bill orders:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [db, tables_id, orders.length]);

  useFocusEffect(useCallback(() => {
    fetchOrders(true);
    const timer = setInterval(() => fetchOrders(false), 3000);
    return () => clearInterval(timer);
  }, [fetchOrders]));

  // ฟังก์ชันอัปเดตสถานะรายการอาหารใน DB สดๆ เมื่อกดปุ่ม Badge
  const toggleItemStatus = async (orderIndex, itemIndex, currentItem) => {
    const currentStatus = currentItem.status || 'pending';
    const nextStatus = STATUS_CONFIG[currentStatus]?.next || 'pending';
    const orderItemId = currentItem.order_item_id || currentItem.id;

    // อัปเดต UI ทันที (Optimistic Update)
    setOrders((prevOrders) => {
      const newOrders = [...prevOrders];
      const targetItems = [...newOrders[orderIndex].items];
      targetItems[itemIndex] = { ...targetItems[itemIndex], status: nextStatus };
      newOrders[orderIndex] = { ...newOrders[orderIndex], items: targetItems };
      return newOrders;
    });

    // อัปเดตลง SQLite DB (ถ้ามี order_item_id)
    if (orderItemId && db) {
      try {
        await db.runAsync(
          `UPDATE order_item SET status = ? WHERE id = ? OR order_item_id = ?`,
          [nextStatus, orderItemId, orderItemId]
        );
      } catch (err) {
        console.error('Failed to update status in DB:', err);
      }
    }
  };

  const grandTotal = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const handleClear = () => {
    Alert.alert('Payment successful', 'Do you want to close this bill and clear the table?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const targetBillId = billId || orders[0]?.bill_id || orders[0]?.billId;
            if (targetBillId) await closeBillAndCheckout(db, targetBillId, tables_id);
            props.onClearAllOrders?.();
            setTimeout(() => navigation?.navigate ? navigation.navigate('Table') : handleBack?.(), 100);
          } catch (error) {
            console.error('Check Bill error:', error);
            setTimeout(() => Alert.alert('Error', `ไม่สามารถปิดบิลได้: ${error.message || 'เกิดข้อผิดพลาด'}`), 100);
          }
        },
      },
    ]);
  };

  if (loading && orders.length === 0) {
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

      {orders.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 48, marginBottom: 10 }}>📄</Text>
          <Text style={{ fontSize: 16, color: colors.dim }}>Doesn't Have Order yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          {orders.map((order, orderIdx) => {
            // ดึงรายการอาหารที่มีโน๊ต
            const itemsWithNotes = (order.items || []).filter(
              (item) => !!(item.note || item.order_item_note || item.item_note || item.remark)
            );

            return (
              <View key={order.orderId || order.order_id || orderIdx} style={styles.orderCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.boldText}>Round {order.round || orderIdx + 1} ({order.orderId || order.order_id || `#${orderIdx + 1}`})</Text>
                  <Text style={styles.subtitle}>{order.date || ''}</Text>
                </View>

                <View style={styles.divider} />

                {/* รายการอาหาร */}
                {order.items?.map((item, itemIdx) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                  return (
                    <View key={item.order_item_id || itemIdx} style={{ marginVertical: 6 }}>
                      <View style={styles.rowBetween}>
                        <Text style={[styles.boldText, { flex: 1, fontSize: 14 }]}>
                          {item.name} × {item.quantity}
                        </Text>
                        
                        {/* ปุ่มเปลี่ยนสถานะ สามารถกดเพื่อทดสอบ/เปลี่ยนสถานะได้ */}
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => toggleItemStatus(orderIdx, itemIdx, item)}
                          style={[styles.badge, { backgroundColor: cfg.bgColor }]}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.color }}>
                            {cfg.label}
                          </Text>
                        </TouchableOpacity>

                        <Text style={styles.boldText}>{(item.price * item.quantity) || 0} ฿</Text>
                      </View>
                    </View>
                  );
                })}

                <View style={styles.divider} />

                <View style={styles.rowBetween}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.dim }}>Round Total</Text>
                  <Text style={[styles.boldText, { color: colors.cyan }]}>{order.totalAmount || 0} ฿</Text>
                </View>

                {/* กรอบข้อความโน๊ตข้างล่างสุด (จะขึ้นเฉพาะเมื่อมีลูกค้าพิมพ์ note มาเท่านั้น) */}
                {itemsWithNotes.length > 0 && (
                  <View style={styles.bottomNoteBox}>
                    <Text style={styles.bottomNoteTitle}>📌 Note:</Text>
                    {itemsWithNotes.map((item, nIdx) => {
                      const noteText = item.note || item.order_item_note || item.item_note || item.remark;
                      return (
                        <Text key={nIdx} style={styles.bottomNoteText}>
                          • <Text style={{ fontWeight: '600' }}>{item.name}:</Text> {noteText}
                        </Text>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {orders.length > 0 && (
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
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  // กรอบโน๊ตข้อความเล็กๆ ด้านล่างสุดของ Card
  bottomNoteBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    backgroundColor: '#FFFDE7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF59D',
  },
  bottomNoteTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 4,
  },
  bottomNoteText: {
    fontSize: 12,
    color: '#424242',
    marginTop: 2,
  },

  footer: { backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  clearBtn: { backgroundColor: colors.cyan, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
});

export default ReceiptScreen;
