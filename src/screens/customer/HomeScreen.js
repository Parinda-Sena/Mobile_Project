import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../styles/Theme';
import { searchMenuItems } from '../../database/db';
import MainCourseScreen from './Menu/MainCourseScreen';
import DrinkScreen from './Menu/DrinkScreen';
import DessertScreen from './Menu/DessertScreen';
import AppetizerScreen from './Menu/AppetizerScreen';
import CartScreen from './CartScreen'; 

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';
const RANKS = [{ bg: '#D4AF37', label: '👑 #1' }, { bg: '#A8A9AD', label: '🥈 #2' }, { bg: '#b47537', label: '🥉 #3' }];
const SCREENS = { appetizer: AppetizerScreen, mainCourse: MainCourseScreen, dessert: DessertScreen, drink: DrinkScreen };
const CATEGORIES = [
  { title: 'Appetizers', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', screen: 'appetizer' },
  { title: 'Main Course', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', screen: 'mainCourse' },
  { title: 'Desserts', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80', screen: 'dessert' },
  { title: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80', screen: 'drink' }
];
export default function HomeScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const { tables_id, tables_number } = route.params || {};
  const [activeTab, setActiveTab] = useState('home');
  const [currentMenuScreen, setCurrentMenuScreen] = useState('none');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [topMenus, setTopMenus] = useState([]);
  useEffect(() => {
    db.getAllAsync(`
      SELECT m.menu_id, m.name, m.price, m.image, SUM(oi.quantity) AS total_sold
      FROM bills b JOIN orders o ON b.bills_id = o.bills_id 
      JOIN order_item oi ON o.order_id = oi.order_id JOIN menu m ON oi.menu_id = m.menu_id
      WHERE b.bills_status = 'closed' AND oi.order_item_status != 'cancel'
      GROUP BY m.menu_id ORDER BY total_sold DESC, m.name ASC LIMIT 10
    `).then(d => setTopMenus(d || [])).catch(console.error);
  }, [db]);
  useEffect(() => {
    if (!searchQuery.trim()) return (setSearchResults([]), setIsSearching(false));
    setIsSearching(true);
    const timer = setTimeout(() => searchMenuItems(db, searchQuery).then(r => setSearchResults(r || [])).finally(() => setIsSearching(false)), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, db]);
  const handleAddToCart = item => setCart(p => {
    const id = item.menu_id || item.name;
    const exist = p.find(i => (i.menu_id || i.name) === id);
    return exist ? p.map(i => (i.menu_id || i.name) === id ? { ...i, quantity: i.quantity + 1 } : i) : [...p, { ...item, quantity: 1 }];
  });
  const handleUpdateQuantity = (item, amt) => setCart(p => p.map(i => (i.menu_id || i.name) === (item.menu_id || item.name) ? (i.quantity + amt > 0 ? { ...i, quantity: i.quantity + amt } : null) : i).filter(Boolean));
  if (currentMenuScreen !== 'none') {
    const Sub = SCREENS[currentMenuScreen];
    return <Sub onBack={() => setCurrentMenuScreen('none')} onAddToCart={handleAddToCart} />;
  }
  const totalCart = cart.reduce((s, i) => s + i.quantity, 0);
  return (
    <View style={S.container}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 }}>
            <View style={S.header}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: colors.dim }}>{tables_number ? `Table ${tables_number}` : 'Welcome'}</Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>What would you like?</Text>
              </View>
              <TouchableOpacity style={S.staffBtn} onPress={() => navigation.navigate('Login', { from: 'Home', currentTable: { tables_id, tables_number } })}>
                <Text style={{ fontSize: 20, color: colors.text }}>☰</Text>
              </TouchableOpacity>
            </View>
            <View style={S.searchBox}>
              <Text>🔍 </Text>
              <TextInput style={{ flex: 1, fontSize: 15, color: colors.text }} placeholder="Search..." placeholderTextColor={colors.dim} value={searchQuery} onChangeText={setSearchQuery} />
              {!!searchQuery && <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={{ color: colors.dim }}>✕</Text></TouchableOpacity>}
            </View>
            {searchQuery.trim() ? (
              <View style={{ gap: 12 }}>
                <Text style={S.secTitle}>Search results ({searchResults.length})</Text>
                {isSearching ? <ActivityIndicator color={colors.cyan} /> : searchResults.map(item => (
                  <View key={item.menu_id} style={S.card}>
                    <View style={S.iconBox}><Image source={{ uri: item.image || DEFAULT_IMG }} style={S.img} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.boldText}>{item.name}</Text>
                      <Text style={{ color: colors.cyan, fontWeight: '600' }}>{item.price} ฿</Text>
                    </View>
                    <TouchableOpacity style={S.addBtn} onPress={() => handleAddToCart(item)}><Text style={{ color: '#FFF', fontSize: 20 }}>+</Text></TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <>
                {!!topMenus.length && (
                  <View style={{ marginBottom: 24 }}>
                    <Text style={[S.secTitle, { marginBottom: 14 }]}>🔥 Best Sellers</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
                      {topMenus.map((item, idx) => {
                        const r = RANKS[idx] || { bg: '#EFEAE4', label: `#${idx + 1}` };
                        return (
                          <View key={item.menu_id} style={S.topCard}>
                            <View style={[S.badge, { backgroundColor: r.bg }]}><Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>{r.label}</Text></View>
                            <View style={S.topImgBox}><Image source={{ uri: item.image || DEFAULT_IMG }} style={S.img} /></View>
                            <Text style={[S.boldText, { height: 38, marginTop: 6 }]} numberOfLines={2}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <View>
                                <Text style={{ fontSize: 15, fontWeight: '800', color: colors.cyan }}>{item.price} ฿</Text>
                                <Text style={{ fontSize: 10, color: colors.dim }}>ขายแล้ว {item.total_sold} จาน</Text>
                              </View>
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
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat.screen} style={S.card} onPress={() => setCurrentMenuScreen(cat.screen)}>
                      <View style={S.iconBox}><Image source={{ uri: cat.image }} style={S.img} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={S.boldText}>{cat.title}</Text>
                        <Text style={{ fontSize: 13, color: colors.dim }}>{cat.title}</Text>
                      </View>
                      <Text style={{ fontSize: 26, color: colors.dim }}> › </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        ) : (
          <CartScreen cart={cart} onUpdateQuantity={handleUpdateQuantity} navigation={navigation} />
        )}
      </View>
      <View style={S.tabBar}>
        {['home', 'cart'].map(t => (
          <TouchableOpacity key={t} style={S.tabItem} onPress={() => setActiveTab(t)}>
            <View>
              {t === 'cart' && totalCart > 0 && <View style={S.cartBadge}><Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>{totalCart}</Text></View>}
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
  topImgBox: { width: '100%', height: 75, borderRadius: 12, overflow: 'hidden', marginVertical: 4 },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  badge: { position: 'absolute', top: 12, left: 12, zIndex: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  addBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.cyan || '#2A7B88', justifyContent: 'center', alignItems: 'center' },
  iconBox: { width: 58, height: 58, borderRadius: 15, backgroundColor: '#F3EEE7', overflow: 'hidden', marginRight: 15 },
  tabBar: { flexDirection: 'row', height: 65, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', right: -10, top: -4, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, zIndex: 1 }
});
