import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import colors from '../components/theme';
function ReceiptScreen(props) {
  const orders = props.orders || props.route?.params?.orders || [];
  const onClearAllOrders =
  props.onClearAllOrders || props.route?.params?.onClearAllOrders;
  const onBack = props.onBack;
  const grandTotal = orders.reduce(
  (sum, order) => sum + (order.totalAmount || 0),0);
  const handleClear = () => {
    Alert.alert('Payment successful','Do you want to delete all bills?',
      [{ text: 'cancel', style: 'cancel' },{text: 'ok',onPress: () => {
            if (onClearAllOrders) { onClearAllOrders(); }},},]);};
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>)}
        <Text style={styles.title}>Receipt</Text>
        <Text style={styles.subtitle}>All ordered food items</Text>
      </View>
      {orders.length === 0 ? ( 
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>Doesn't Have Order yet</Text>
        </View>) : (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false} >
          {orders.map((order, index) => (
            <View key={order.orderId || index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.orderId}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.divider} />
              {order.items?.map((item, itemIdx) => (
                <View key={itemIdx} style={styles.itemRow}>
                  <Text style={styles.itemName}> {item.name} × {item.quantity} </Text>
                  <Text style={styles.itemPrice}> {item.price * item.quantity} ฿ </Text>
                </View> ))}
              <View style={styles.divider} />
              <View style={styles.orderTotalRow}>
                <Text style={styles.orderTotalTitle}> all on one bill</Text>
                <Text style={styles.orderTotalPrice}>{order.totalAmount} ฿ </Text>
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
          <TouchableOpacity style={styles.clearBtn} activeOpacity={0.8} onPress={handleClear} >
            <Text style={styles.clearBtnText}>Check Bill</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: colors.bg,},
  header: {paddingHorizontal: 24,paddingTop: 45,paddingBottom: 15,},
  backBtn: {marginBottom: 8,},
  backText: {fontSize: 16,color: colors.cyan,fontWeight: '600',},
  title: {fontSize: 24,fontWeight: '700',color: colors.text,},
  subtitle: {fontSize: 14,color: colors.dim,marginTop: 2,},
  scrollArea: {flex: 1,},
  orderList: {paddingHorizontal: 24,paddingBottom: 20,gap: 16,},
  orderCard: {backgroundColor: colors.card,borderRadius: 16,borderWidth: 1,
    borderColor: colors.border,padding: 16,},
  orderHeader: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',},
  orderId: {fontSize: 16,fontWeight: '700',color: colors.text,},
  orderDate: {fontSize: 13,color: colors.dim,},
  divider: {height: 1,backgroundColor: colors.border,marginVertical: 10,},
  itemRow: {flexDirection: 'row',justifyContent: 'space-between',marginVertical: 3,},
  itemName: {fontSize: 14,color: colors.text,},
  itemPrice: {fontSize: 14,fontWeight: '600',color: colors.text,},
  orderTotalRow: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',},
  orderTotalTitle: {fontSize: 14,fontWeight: '600',color: colors.dim,},
  orderTotalPrice: {fontSize: 16,fontWeight: '700',color: colors.cyan,},
  emptyContainer: {flex: 1,justifyContent: 'center',alignItems: 'center',},
  emptyIcon: {fontSize: 48,marginBottom: 10,},
  emptyText: {fontSize: 16,color: colors.dim,},
  footer: {backgroundColor: colors.card,borderTopWidth: 1,borderColor: colors.border,
    paddingHorizontal: 24,paddingTop: 16,paddingBottom: 24,},
  grandTotalRow: {flexDirection: 'row',justifyContent: 'space-between',
    alignItems: 'center',marginBottom: 14,},
  grandTotalTitle: {fontSize: 16,fontWeight: '600',color: colors.text,},
  grandTotalPrice: {fontSize: 22,fontWeight: '700',color: colors.cyan,},
  clearBtn: {backgroundColor: colors.cyan,borderRadius: 16,paddingVertical: 14,alignItems: 'center',},
  clearBtnText: {color: colors.card,fontSize: 15,fontWeight: '700',},
});
export default ReceiptScreen;
