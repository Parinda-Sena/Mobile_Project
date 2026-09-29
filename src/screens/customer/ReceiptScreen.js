import React, { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import colors from '../../styles/Theme';
import { getActiveBillOrders, closeBillAndCheckout } from '../../database/db'; // นำเข้าฟังก์ชันที่เราเพิ่งสร้าง

function ReceiptScreen(props) {
  const db = useSQLiteContext();

  const tables_id = props.tables_id ?? props.route?.params?.tables_id;
  const tables_number = props.tables_number ?? props.route?.params?.tables_number;
  const onClearAllOrders = props.onClearAllOrders || props.route?.params?.onClearAllOrders;
  const onBack = props.onBack;

  const [billId, setBillId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลออเดอร์จริงจาก Database เมื่อหน้าจอแสดงขึ้นมา
  useEffect(() => {
    async function loadBillData() {
      if (!tables_id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await getActiveBillOrders(db, tables_id);
        setBillId(result.billId);
        setOrders(result.orders);
      } catch (error) {
        console.error('Failed to load bill orders:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBillData();
  }, [db, tables_id]);

  const grandTotal = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const handleClear = () => {
    Alert.alert('Payment successful', 'Do you want to close this bill and clear the table?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            if (billId) {
              // ทำการปิดบิลและอัปเดตสถานะโต๊ะใน Database จริง
              await closeBillAndCheckout(db, billId, tables_id);
            }

            if (onClearAllOrders) {
              onClearAllOrders();
            }

            if (props.navigation?.navigate) {
              props.navigation.navigate('Table');
            } else if (onBack) {
              onBack();
            }
          } catch (error) {
            console.error('Check Bill error:', error);
            Alert.alert('Error', 'ไม่สามารถบันทึกการชำระเงินได้ กรุณาลองใหม่อีกครั้ง');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.cyan} />
        <Text style={{ color: colors.dim, marginTop: 10 }}>Loading receipt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Receipt {tables_number ? `(Table ${tables_number})` : ''}</Text>
        <Text style={styles.subtitle}>All ordered food items</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>Doesn't Have Order yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          {orders.map((order, index) => (
            <View key={order.orderId || index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Round {order.round} ({order.orderId})</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.divider} />
              {order.items?.map((item, itemIdx) => (
                <View key={itemIdx} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.name} {item.note ? `(${item.note})` : ''} × {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price * item.quantity} ฿</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.orderTotalRow}>
                <Text style={styles.orderTotalTitle}>Round Total</Text>
                <Text style={styles.orderTotalPrice}>{order.totalAmount} ฿</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

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
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  itemName: { fontSize: 14, color: colors.text, flex: 1, marginRight: 10 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: colors.text },
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