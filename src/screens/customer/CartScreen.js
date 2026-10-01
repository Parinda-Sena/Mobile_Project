import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../styles/Theme';
import { getActiveBillOrders } from '../../database/db';
function CartScreen({   cart = [],  orders: propsOrders = [],tables_id: propsTableId,
  tables_number: propsTableNum,onUpdateQuantity,onUpdateNote,onCheckout,onViewReceipt,
  navigation,route,}) {
  const db = useSQLiteContext();
  const activeTableId = propsTableId ?? route?.params?.tables_id ?? route?.params?.currentTable?.tables_id;
  const activeTableNumber = propsTableNum ?? route?.params?.tables_number ?? route?.params?.currentTable?.tables_number;
  const [activeOrders, setActiveOrders] = useState(propsOrders);
  const [itemNotes, setItemNotes] = useState({});
  const [expandedItemId, setExpandedItemId] = useState(null);
const fetchActiveOrders = useCallback(async () => {
    if (!activeTableId || !db) return;
    try {
      const result = await getActiveBillOrders(db, activeTableId);
      if (result?.orders && Array.isArray(result.orders)) {
        setActiveOrders(result.orders);
      }
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
    }
  }, [db, activeTableId]);
useFocusEffect(
    useCallback(() => {
      fetchActiveOrders();
      const timer = setInterval(fetchActiveOrders, 3000);
      return () => clearInterval(timer);
    }, [fetchActiveOrders])
  );
const displayOrders = activeOrders.length > 0 ? activeOrders : propsOrders;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
const handleNoteChange = (itemId, text) => {
    setItemNotes((prev) => ({ ...prev, [itemId]: text }));
    onUpdateNote?.(itemId, text);
  };
const handleToggleNote = (itemId) => {
    setExpandedItemId((prevId) => (prevId === itemId ? null : itemId));
  };
const handleGoToReceipt = () => {
    if (onViewReceipt) {
      onViewReceipt(displayOrders);
    } else if (navigation?.navigate) {
      navigation.navigate('Receipt', {
        orders: displayOrders,
        tables_id: activeTableId,
        tables_number: activeTableNumber,
      });
    }
  };
const handleCheckout = async () => {
    if (cart.length === 0) return;
    const itemsWithNotes = cart.map((item) => {
      const itemId = item.id ?? item.menu_id ?? item.item_id;
      return { ...item, note: itemNotes[itemId] ?? item.note ?? '' };
    });
    const newOrder = {
      orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      items: itemsWithNotes,
      totalAmount: totalPrice,
    };
    if (onCheckout) await onCheckout(newOrder);
    await fetchActiveOrders();
    handleGoToReceipt();
  };

  const renderItemImage = (item) => {
    const imageSource = item.image || item.image_url || item.img;

    if (imageSource && typeof imageSource === 'string' && imageSource.trim() !== '') {
      return (
        <Image
          source={{ uri: imageSource }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      );
    }

    return <Text style={{ fontSize: 30 }}>{item.icon || '🍛'}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rowBetween}>
          <Text style={{ fontSize: 32, marginBottom: 4 }}>🛒</Text>
          <TouchableOpacity style={styles.receiptBtn} onPress={handleGoToReceipt} activeOpacity={0.7}>
            <Text style={{ color: '#E65100', fontWeight: '700', fontSize: 13 }}>Order/Receipts</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Your Cart {activeTableNumber ? `(Table ${activeTableNumber})` : ''}</Text>
        <Text style={styles.subtitle}>All your orders</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 50, marginBottom: 12 }}>🍽️</Text>
          <Text style={styles.title}>Doesn't have orders yet</Text>
          <Text style={styles.subtitle}>Order your food to start</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.cartList} showsVerticalScrollIndicator={false}>
          {cart.map((item, index) => {
            const itemId = item.id ?? item.menu_id ?? item.item_id ?? index;
            const isExpanded = expandedItemId === itemId;
            const currentNote = itemNotes[itemId] ?? item.note ?? '';

            return (
              <View key={`${itemId}-${index}`} style={[styles.cartCard, isExpanded && styles.cartCardActive]}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  activeOpacity={0.7}
                  onPress={() => handleToggleNote(itemId)}
                >
                  <View style={styles.imageBox}>
                    {renderItemImage(item)}
                  </View>

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.subtitle}>
                      {item.price} ฿ × {item.quantity} ={' '}
                      <Text style={{ fontWeight: '700', color: colors.cyan }}>{item.price * item.quantity} ฿</Text>
                    </Text>
                    
                    {!isExpanded && (
                      <Text style={styles.addNoteBtnText}>
                        {currentNote ? ` Note: ${currentNote}` : ' Add note...'}
                      </Text>
                    )}
                  </View>

                  <View style={[styles.rowCenter, styles.qtyBox]}>
                    <TouchableOpacity style={styles.qtyBtn} activeOpacity={0.7} onPress={() => onUpdateQuantity?.(item, -1)}>
                      <Text style={styles.boldText}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.boldText, { marginHorizontal: 10 }]}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} activeOpacity={0.7} onPress={() => onUpdateQuantity?.(item, 1)}>
                      <Text style={styles.boldText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.noteContainer}>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Note (ex. No ice, No sweet)"
                      placeholderTextColor={colors.dim || '#888'}
                      value={currentNote}
                      onChangeText={(text) => handleNoteChange(itemId, text)}
                      maxLength={100}
                      autoFocus={true}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {cart.length === 0 ? null : (
        <View style={styles.footer}>
          <View style={[styles.rowBetween, { marginBottom: 14 }]}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Total</Text>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.cyan }}>{totalPrice} ฿</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8} onPress={handleCheckout}>
            <Text style={{ color: colors.card, fontSize: 15, fontWeight: '700' }}>Checkout ({totalQuantity} items)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  boldText: { fontSize: 16, fontWeight: '700', color: colors.text },
  header: { paddingHorizontal: 24, paddingTop: 45, paddingBottom: 15 },
  receiptBtn: { backgroundColor: '#FFF3E0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E65100' },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 2 },
  cartList: { paddingHorizontal: 24, paddingBottom: 20, gap: 12 },
  cartCard: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 12 },
  cartCardActive: { borderColor: colors.cyan },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  imageBox: { width: 60, height: 60, borderRadius: 14, backgroundColor: '#F3EEE7', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  qtyBox: { backgroundColor: '#F3EEE7', borderRadius: 12, padding: 4 },
  qtyBtn: { width: 30, height: 30, backgroundColor: colors.card, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addNoteBtnText: { fontSize: 12, color: colors.cyan || '#00A896', marginTop: 4, fontWeight: '600' },
  noteContainer: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  noteInput: { backgroundColor: '#F9F9F9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: colors.text, borderWidth: 1, borderColor: '#EBEBEB' },
  footer: { backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  checkoutBtn: { backgroundColor: colors.cyan, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
});

export default CartScreen;