import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../styles/Theme';
import { getActiveBillOrders } from '../../database/db';

function CartScreen({
  cart = [],
  orders: propsOrders = [],
  tables_id: propsTableId,
  tables_number: propsTableNum,
  onUpdateQuantity,
  onCheckout,
  onClearAllOrders,
  onViewReceipt,
  navigation,
  route,
}) {
  const db = useSQLiteContext();

  const activeTableId = propsTableId ?? route?.params?.tables_id ?? route?.params?.currentTable?.tables_id;
  const activeTableNumber = propsTableNum ?? route?.params?.tables_number ?? route?.params?.currentTable?.tables_number;

  const [activeOrders, setActiveOrders] = useState(propsOrders);

  const fetchActiveOrders = useCallback(async () => {
    if (!activeTableId || !db) return;
    try {
      const result = await getActiveBillOrders(db, activeTableId);
      if (result && result.orders && Array.isArray(result.orders)) {
        setActiveOrders(result.orders);
      }
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
    }
  }, [db, activeTableId]);

  useFocusEffect(
    useCallback(() => {
      fetchActiveOrders();
      const timer = setInterval(() => {
        fetchActiveOrders();
      }, 3000);

      return () => clearInterval(timer);
    }, [fetchActiveOrders])
  );

  const displayOrders = activeOrders.length > 0 ? activeOrders : propsOrders;

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const newOrder = {
      orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      totalAmount: totalPrice,
    };

    if (onCheckout) {
      await onCheckout(newOrder);
    }

    await fetchActiveOrders();
    handleGoToReceipt();
  };

  const handleGoToReceipt = () => {
    if (onViewReceipt) {
      onViewReceipt(displayOrders);
    } else if (navigation?.navigate) {
      navigation.navigate('Receipt', {
        orders: displayOrders,
        tables_id: activeTableId,
        tables_number: activeTableNumber,
        onClearAllOrders,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerIcon}>🛒</Text>
          
          {/* ปุ่มมุมขวาบนอันเดียวแบบถาวร */}
          <TouchableOpacity
            style={styles.headerReceiptBtn}
            onPress={handleGoToReceipt}
            activeOpacity={0.7}
          >
            <Text style={styles.headerReceiptText}>
              🧾 ดูสถานะอาหาร / บิล
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          Your Cart {activeTableNumber ? `(Table ${activeTableNumber})` : ''}
        </Text>
        <Text style={styles.subtitle}>All your order</Text>
      </View>

      {/* Cart Items / Empty State */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>ไม่มีรายการในตะกร้า</Text>
          <Text style={styles.emptySubtext}>เลือกรายการอาหารเพื่อเริ่มสั่งซื้อ</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.cartList}
          showsVerticalScrollIndicator={false}
        >
          {cart.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.cartCard}>
              <View style={styles.imageBox}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {item.price} ฿ × {item.quantity} ={' '}
                  <Text style={styles.itemTotalPrice}>
                    {item.price * item.quantity} ฿
                  </Text>
                </Text>
              </View>
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  activeOpacity={0.7}
                  onPress={() => onUpdateQuantity?.(item, -1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  activeOpacity={0.7}
                  onPress={() => onUpdateQuantity?.(item, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Footer Checkout */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Total</Text>
            <Text style={styles.totalPrice}>{totalPrice} ฿</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.8}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>
              Checkout ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 45, paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerIcon: { fontSize: 32, marginBottom: 4 },
  headerReceiptBtn: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E65100',
  },
  headerReceiptText: { color: '#E65100', fontWeight: '700', fontSize: 13 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 2 },
  scrollArea: { flex: 1 },
  cartList: { paddingHorizontal: 24, paddingBottom: 20, gap: 12 },
  cartCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F3EEE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: { fontSize: 30 },
  infoBox: { flex: 1, marginLeft: 14 },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  itemPrice: { fontSize: 13, color: colors.dim },
  itemTotalPrice: { fontWeight: '700', color: colors.cyan },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEE7',
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: colors.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  qtyText: { marginHorizontal: 10, fontSize: 14, fontWeight: '700', color: colors.text },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: colors.dim, textAlign: 'center' },
  footer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  totalPrice: { fontSize: 22, fontWeight: '700', color: colors.cyan },
  checkoutBtn: {
    backgroundColor: colors.cyan,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: { color: colors.card, fontSize: 15, fontWeight: '700' },
});

export default CartScreen;