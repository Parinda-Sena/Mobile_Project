import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../styles/Theme';
import { searchMenuItems, createOrder } from '../../database/db';
import MainCourseScreen from './Menu/MainCourseScreen';
import DrinkScreen from './Menu/DrinkScreen';
import DessertScreen from './Menu/DessertScreen';
import AppetizerScreen from './Menu/AppetizerScreen';
import CartScreen from './CartScreen'; 
import ReceiptScreen from './ReceiptScreen';

export default function HomeScreen({ navigation, route }) {
  const db = useSQLiteContext(); 
  const { tables_id, tables_number } = route.params || {};
  const [activeTab, setActiveTab] = useState('home');
  const [currentMenuScreen, setCurrentMenuScreen] = useState('none');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [topMenus, setTopMenus] = useState([]);

  useEffect(() => {
    db.getAllAsync(`
      SELECT m.menu_id, m.name, m.price, SUM(oi.quantity) AS total_sold
      FROM bills b JOIN orders o ON b.bills_id = o.bills_id JOIN order_item oi ON o.order_id = oi.order_id JOIN menu m ON oi.menu_id = m.menu_id
      WHERE b.bills_status = 'closed' AND oi.order_item_status != 'cancel'
      GROUP BY m.menu_id, m.name, m.price ORDER BY total_sold DESC, m.name ASC LIMIT 10
    `).then(data => setTopMenus(data || [])).catch(console.error);
  }, [db]);
  useEffect(() => { 
    if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    const timer = setTimeout(() => { searchMenuItems(db, searchQuery).then(res => setSearchResults(res || [])).finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, db]);
  const handleAddToCart = (item) => setCart(prev => {
    const exist = prev.find(i => (i.menu_id && i.menu_id === item.menu_id) || i.name === item.name);
    return exist ? prev.map(i => (i.menu_id === item.menu_id || i.name === item.name) ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...item, quantity: 1 }];
  });
  const handleUpdateQuantity = (item, amount) => setCart(prev => prev.map(i => {
    if ((i.menu_id && i.menu_id === item.menu_id) || i.name === item.name) {
      const q = i.quantity + amount; return q > 0 ? { ...i, quantity: q } : null;
    } return i;
  }).filter(Boolean));
  const ranks = [{ bg: '#D4AF37', text: '#FFF', label: '👑 #1' }, { bg: '#A8A9AD', text: '#FFF', label: '🥈 #2' }, { bg: '#C5A059', text: '#FFF', label: '🥉 #3' }];
  const categories = [{ id: 'C004', title: 'Appetizers', subtitle: 'Appetizers', icon: '🥗', screen: 'appetizer' }, { id: 'C003', title: 'Main Course', subtitle: 'Main Course', icon: '🍛', screen: 'mainCourse' }, { id: 'C001', title: 'Desserts', subtitle: 'Desserts', icon: '🍰', screen: 'dessert' }, { id: 'C002', title: 'Beverages', subtitle: 'Beverages', icon: '🥤', screen: 'drink' }];
  const screens = { appetizer: AppetizerScreen, mainCourse: MainCourseScreen, dessert: DessertScreen, drink: DrinkScreen };
  if (currentMenuScreen !== 'none') { const Sub = screens[currentMenuScreen]; return <Sub onBack={() => setCurrentMenuScreen('none')} onAddToCart={handleAddToCart} />; }
  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <View style={S.container}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 }}>
            <View style={S.header}>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 14, color: colors.dim }}>{tables_number ? `Table ${tables_number}` : 'Welcome'}</Text><Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>What would you like?</Text></View>
              <TouchableOpacity style={S.staffBtn} onPress={() => navigation.navigate('Login', { from: 'Home', currentTable: { tables_id, tables_number } })}><Text style={{ fontSize: 20, color: colors.text }}>☰</Text></TouchableOpacity>
            </View>
            <View style={S.searchBox}>
              <Text>🔍 </Text>
              <TextInput style={{ flex: 1, fontSize: 15, color: colors.text }} placeholder="Search..." placeholderTextColor={colors.dim} value={searchQuery} onChangeText={setSearchQuery} />
              {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={{ color: colors.dim }}>✕</Text></TouchableOpacity>}
            </View>
            {searchQuery.trim().length > 0 ? (
              <View style={{ gap: 12 }}>
                <Text style={S.secTitle}>Search results ({searchResults.length})</Text>
                {isSearching ? <ActivityIndicator color={colors.cyan} /> : searchResults.map(item => (
                  <View key={item.menu_id} style={S.card}>
                    <View style={{ flex: 1 }}><Text style={S.boldText}>{item.name}</Text><Text style={{ color: colors.cyan, fontWeight: '600' }}>{item.price} ฿</Text></View>
                    <TouchableOpacity style={S.addBtn} onPress={() => handleAddToCart(item)}><Text style={{ color: '#FFF', fontSize: 20 }}>+</Text></TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <>
                {topMenus.length > 0 && (
                  <View style={{ marginBottom: 24 }}>
                    <Text style={[S.secTitle, { marginBottom: 14 }]}>🔥 Best Sellers</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
                      {topMenus.map((item, idx) => {
                        const r = ranks[idx] || { bg: '#EFEAE4', text: '#7A6B5D', label: `#${idx + 1}` };
                        return (
                          <View key={item.menu_id} style={S.topCard}>
                            <View style={[S.badge, { backgroundColor: r.bg }]}><Text style={{ fontSize: 11, fontWeight: '800', color: r.text }}>{r.label}</Text></View>
                            <Text style={{ fontSize: 32, textAlign: 'center', marginVertical: 8 }}>✨</Text>
                            <Text style={[S.boldText, { height: 38 }]} numberOfLines={2}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <View><Text style={{ fontSize: 15, fontWeight: '800', color: colors.cyan }}>{item.price} ฿</Text><Text style={{ fontSize: 10, color: colors.dim }}>ขายแล้ว {item.total_sold} จาน</Text></View>
                              <TouchableOpacity style={S.addBtn} onPress={() => handleAddToCart(item)}><Text style={{ color: '#FFF', fontSize: 20 }}>+</Text></TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
                <Text style={S.secTitle}>Menu Categories</Text>
                <View style={{ gap: 14, marginTop: 14 }}>
                  {categories.map(cat => (
                    <TouchableOpacity key={cat.id} style={S.card} onPress={() => setCurrentMenuScreen(cat.screen)}>
                      <View style={S.iconBox}><Text style={{ fontSize: 28 }}>{cat.icon}</Text></View>
                      <View style={{ flex: 1 }}><Text style={S.boldText}>{cat.title}</Text><Text style={{ fontSize: 13, color: colors.dim }}>{cat.subtitle}</Text></View>
                      <Text style={{ fontSize: 26, color: colors.dim }}> › </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        )}
        {activeTab === 'cart' && (
          <CartScreen 
            cart={cart} 
            orders={orders} 
            onUpdateQuantity={handleUpdateQuantity} 
            onCheckout={async (o) => { await createOrder(db, tables_id, cart); setOrders(p => [...p, o]); setCart([]); }} 
            onClearAllOrders={() => { setOrders([]); setActiveTab('home'); }} 
            onViewReceipt={(u) => { 
              u && setOrders(u); navigation?.navigate ? navigation.navigate('Receipt', { orders: u || orders, tables_id, tables_number }) 
                : setActiveTab('receipt'); }} navigation={navigation} />
        )}
        {activeTab === 'receipt' && (
          <ReceiptScreen orders={orders} tables_id={tables_id} tables_number={tables_number} 
            onClearAllOrders={() => { setOrders([]); setActiveTab('home'); }} onBack={() => setActiveTab('cart')} />
        )}
      </View>
      <View style={S.tabBar}>
        {['home', 'cart'].map(t => (
          <TouchableOpacity key={t} style={S.tabItem} onPress={() => setActiveTab(t)}>
            <View>
              {t === 'cart' && totalCartCount > 0 && (
                <View style={S.cartBadge}>
                  <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>{totalCartCount}</Text>
                </View>
              )}
              <Text style={{ fontSize: 22, opacity: activeTab === t ? 1 : 0.5 }}>{t === 'home' ? '🏠' : '🛒'}</Text>
            </View>
            <Text style={{ fontSize: 12, color: activeTab === t ? colors.cyan : colors.dim, fontWeight: activeTab === t ? '700' : 'normal' }}>{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  staffBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, height: 48, marginBottom: 20 },
  secTitle: { fontSize: 19, fontWeight: '700', color: colors.text },
  boldText: { fontSize: 14, fontWeight: '700', color: colors.text },
  card: { minHeight: 80, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center' },
  topCard: { width: 155, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 14, position: 'relative' },
  badge: { position: 'absolute', top: 12, left: 12, zIndex: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  addBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.cyan || '#2A7B88', justifyContent: 'center', alignItems: 'center' },
  iconBox: { width: 58, height: 58, borderRadius: 15, backgroundColor: '#F3EEE7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  tabBar: { flexDirection: 'row', height: 65, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', right: -10, top: -4, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, zIndex: 1 }
});