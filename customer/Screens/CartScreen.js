import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,} from 'react-native';
import colors from '../components/theme';

function CartScreen({cart = [],orders = [],onUpdateQuantity,onCheckout,  onClearAllOrders,
  onViewReceipt, navigation,}) {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0 );
  const handleCheckout = () => { 
    if (cart.length === 0) return;
    const newOrder = { orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleTimeString('th-TH', {hour: '2-digit',minute: '2-digit',}),
      items: [...cart],
      totalAmount: totalPrice,
    };
    const allOrders = [...orders, newOrder];
    if (onCheckout) { onCheckout(newOrder);}
    if (onViewReceipt) {onViewReceipt(allOrders);
    } else if (navigation?.navigate) {navigation.navigate('Receipt', {orders: allOrders,onClearAllOrders, });
    }
  };
  const handleViewReceipt = () => { 
    if (onViewReceipt) {onViewReceipt(orders);} else if (navigation?.navigate) {
      navigation.navigate('Receipt', {orders,onClearAllOrders,});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🛒</Text>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>All your order</Text>
      </View>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>Doesn't have oder yet</Text>
          <Text style={styles.emptySubtext}>Order Your Food!</Text>

          {orders.length > 0 && (
            <TouchableOpacity style={styles.viewReceiptBtn} activeOpacity={0.8} onPress={handleViewReceipt} >
              <Text style={styles.viewReceiptText}> The Receipt ({orders.length}) 
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.cartList} showsVerticalScrollIndicator={false} >
          {cart.map((item, index) => ( 
            <View key={`${item.id}-${index}`} style={styles.cartCard} >
              <View style={styles.imageBox}> 
                <Text style={styles.itemIcon}> {item.icon} </Text>
              </View>
              <View style={styles.infoBox}> 
                <Text style={styles.itemName}> {item.name} </Text>
                <Text style={styles.itemPrice}> {item.price} ฿ × {item.quantity} ={' '}
                  <Text style={styles.itemTotalPrice}> {item.price * item.quantity} ฿</Text>
                </Text>
              </View>
              <View style={styles.qtyContainer}> 
                <TouchableOpacity style={styles.qtyBtn} activeOpacity={0.7} onPress={() => onUpdateQuantity?.(item, -1) } >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}> {item.quantity} </Text>
                <TouchableOpacity style={styles.qtyBtn} activeOpacity={0.7} onPress={() => onUpdateQuantity?.(item, 1) } >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {cart.length > 0 && (
        <View style={styles.footer}> 
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Total </Text>
            <Text style={styles.totalPrice}> {totalPrice} ฿ </Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8} onPress={handleCheckout} >
            <Text style={styles.checkoutText}> Checkout ( {cart.reduce( (sum, item) => sum + item.quantity,0 )}{' '} order)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: colors.bg,},
  header: {paddingHorizontal: 24,paddingTop: 45,paddingBottom: 15,},
  headerIcon: {fontSize: 32,marginBottom: 4,},
  title: {fontSize: 26,fontWeight: '700',color: colors.text,},
  subtitle: {fontSize: 14,color: colors.dim,marginTop: 2,},
  scrollArea: {flex: 1,},
  cartList: {paddingHorizontal: 24,paddingBottom: 20,gap: 12,},
  cartCard: {backgroundColor: colors.card,borderRadius: 18,borderWidth: 1,
    borderColor: colors.border,padding: 12,flexDirection: 'row',alignItems: 'center',},
  imageBox: {width: 60,height: 60,borderRadius: 14,backgroundColor: '#F3EEE7',
    justifyContent: 'center',alignItems: 'center',},
  itemIcon: {fontSize: 30,},
  infoBox: {flex: 1,marginLeft: 14,},
  itemName: {fontSize: 15,fontWeight: '700',color: colors.text,marginBottom: 4,},
  itemPrice: {fontSize: 13,color: colors.dim,},
  itemTotalPrice: {fontWeight: '700',color: colors.cyan,},
  qtyContainer: {flexDirection: 'row',alignItems: 'center',backgroundColor: '#F3EEE7',
    borderRadius: 12,padding: 4,},
  qtyBtn: {width: 30,height: 30,backgroundColor: colors.card,borderRadius: 8,
    justifyContent: 'center',alignItems: 'center',  },
  qtyBtnText: {fontSize: 16,fontWeight: 'bold',color: colors.text,  },
  qtyText: {marginHorizontal: 10,fontSize: 14,fontWeight: '700',color: colors.text,},
  emptyContainer: {flex: 1,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 30,},
  emptyIcon: {fontSize: 50,marginBottom: 12,},
  emptyText: {fontSize: 18,fontWeight: '700',color: colors.text,marginBottom: 6,},
  emptySubtext: {fontSize: 14,color: colors.dim,textAlign: 'center',},
  viewReceiptBtn: {marginTop: 20,paddingHorizontal: 20,paddingVertical: 12,backgroundColor: colors.card,
  borderRadius: 12,borderWidth: 1,borderColor: colors.cyan,},
  viewReceiptText: {fontSize: 14,fontWeight: '700',color: colors.cyan,},
  footer: {backgroundColor: colors.card,borderTopWidth: 1,borderColor: colors.border,
  paddingHorizontal: 24,paddingTop: 16,paddingBottom: 24,},
  totalRow: {flexDirection: 'row',justifyContent: 'space-between',marginBottom: 14,},
  totalTitle: {fontSize: 16,fontWeight: '600',color: colors.text,},
  totalPrice: {fontSize: 22,fontWeight: '700',color: colors.cyan,},
  checkoutBtn: {backgroundColor: colors.cyan,borderRadius: 16,    
    paddingVertical: 14,alignItems: 'center',},
  checkoutText: {color: colors.card,fontSize: 15,fontWeight: '700',},
});
export default CartScreen;
