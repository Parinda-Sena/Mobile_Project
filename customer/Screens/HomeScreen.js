import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,ScrollView,StyleSheet,TextInput,ActivityIndicator,} from 'react-native';
import * as SQLite from 'expo-sqlite';
import colors from '../components/theme';
import MainCourseScreen from './Menu/MainCourseScreen';
import DrinkScreen from './Menu/DrinkScreen';
import DessertScreen from './Menu/DessertScreen';
import AppetizerScreen from './Menu/AppetizerScreen';
import CartScreen from './CartScreen'; 
import ReceiptScreen from './ReceiptScreen';

const DATABASE_NAME = 'my_restaurant.db';
function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [currentMenuScreen, setCurrentMenuScreen] = useState('none');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    let isMounted = true;
    async function searchMenu() {
      if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); return; }
      setIsSearching(true); 
      try {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        const results = await db.getAllAsync( 'SELECT menu_id, name, price, category_id FROM menu WHERE name LIKE ?',
          [`%${searchQuery.trim()}%`]
        );
         if (isMounted) { setSearchResults(results); }
      } catch (error) { 
        console.error('Error searching menu:', error);
      } finally {
        if (isMounted) { setIsSearching(false); } }}
    const timer = setTimeout(() => { searchMenu(); }, 300);
    return () => {isMounted = false; clearTimeout(timer);}; }, [searchQuery]);
  const goBackToCategories = () => setCurrentMenuScreen('none');
  const handleAddToCart = (item) => { 
    setCart((prevCart) => { const existingItem = prevCart.find(
        (cartItem) => (cartItem.menu_id && cartItem.menu_id === item.menu_id) || (cartItem.id && cartItem.id === item.id) || cartItem.name === item.name
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          (cartItem.menu_id && cartItem.menu_id === item.menu_id) || cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };
  const handleUpdateQuantity = (item, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((cartItem) => {
          if ((cartItem.menu_id && cartItem.menu_id === item.menu_id) || (cartItem.id && cartItem.id === item.id) || cartItem.name === item.name) {
            const newQty = cartItem.quantity + amount;
            return newQty > 0 ? { ...cartItem, quantity: newQty } : null;
          } 
          return cartItem;
        })
        .filter(Boolean);
    });
  };
  const handleCheckout = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCart([]);};  
  const handleClearAllOrders = () => {
    setOrders([]);
    setActiveTab('home'); 
  };
  const handleViewReceipt = (updatedOrders) => {
    if (updatedOrders) {
      setOrders(updatedOrders);
    }
    if (navigation?.navigate) {
      navigation.navigate('Receipt', {
        orders: updatedOrders || orders,
        onClearAllOrders: handleClearAllOrders,
      });
    } else {
      setActiveTab('receipt');
    }
  };
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = [
    { id: 'C004', title: 'Appetizers', subtitle: 'อาหารเรียกน้ำย่อย', icon: '🥗', screen: 'appetizer' },
    { id: 'C003', title: 'Main Course', subtitle: 'อาหารจานหลัก', icon: '🍛', screen: 'mainCourse' },
    { id: 'C001', title: 'Desserts', subtitle: 'ขนมหวาน', icon: '🍰', screen: 'dessert' },
    { id: 'C002', title: 'Beverages', subtitle: 'เครื่องดื่ม', icon: '🥤', screen: 'drink' },
  ];
  const renderSubMenuScreen = () => {
    if (currentMenuScreen === 'appetizer')
      return <AppetizerScreen onBack={goBackToCategories} onAddToCart={handleAddToCart} />;
    if (currentMenuScreen === 'mainCourse')
      return <MainCourseScreen onBack={goBackToCategories} onAddToCart={handleAddToCart} />;
    if (currentMenuScreen === 'dessert')
      return <DessertScreen onBack={goBackToCategories} onAddToCart={handleAddToCart} />;
    if (currentMenuScreen === 'drink')
      return <DrinkScreen onBack={goBackToCategories} onAddToCart={handleAddToCart} />;
    return null;
  };
  if (currentMenuScreen !== 'none') {
    return renderSubMenuScreen();
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {activeTab === 'home' && (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
            <View style={styles.header}>
              <View>
                <Text style={styles.smallTitle}>Welcome</Text>
                <Text style={styles.title}>What would you like?</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor={colors.dim} value={searchQuery} onChangeText={setSearchQuery} />
              {searchQuery.length > 0 && ( <TouchableOpacity onPress={() => setSearchQuery('')}> <Text style={styles.clearSearchText}>✕</Text> </TouchableOpacity> )}
            </View>
            {searchQuery.trim().length > 0 ? ( 
              <View style={styles.searchResultsContainer}>
                <Text style={styles.sectionTitle}>Search results  ({searchResults.length})
                </Text>
                {isSearching ? (
                  <ActivityIndicator size="small" color={colors.cyan} style={{ marginTop: 20 }} />
                ) : searchResults.length > 0 ? ( searchResults.map((item) => (
                    <View key={item.menu_id} style={styles.menuCard}>
                      <View style={styles.menuInfo}>
                        <Text style={styles.menuName}>{item.name}</Text>
                        <Text style={styles.menuPrice}>{item.price} ฿</Text>
                      </View>
                      <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => handleAddToCart(item)} >
                        <Text style={styles.addText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.notFoundText}>ไม่พบเมนูที่คุณค้นหา</Text>
                )}
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Menu Categories</Text>
                <View style={styles.categoryContainer}>
                  {categories.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.categoryCard}
                      activeOpacity={0.8} onPress={() => setCurrentMenuScreen(item.screen)} >
                      <View style={styles.iconBox}>
                        <Text style={styles.categoryIcon}>{item.icon}</Text>
                      </View>
                      <View style={styles.categoryText}>
                        <Text style={styles.categoryTitle}>{item.title}</Text>
                        <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
                      </View>
                      <Text style={styles.arrow}> › </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        )}
        {activeTab === 'cart' && (
          <CartScreen cart={cart} orders={orders} onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout} onClearAllOrders={handleClearAllOrders} onViewReceipt={handleViewReceipt} navigation={navigation} />
        )}
        {activeTab === 'receipt' && ( 
          <ReceiptScreen orders={orders} onClearAllOrders={handleClearAllOrders} onBack={() => setActiveTab('cart')} />
        )}
      </View>
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={() => setActiveTab('home')}>
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.activeTabIcon]}> 🏠</Text>
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}> Home </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}activeOpacity={0.7}onPress={() => setActiveTab('cart')}>
          <View>
            <Text style={[styles.tabIcon, activeTab === 'cart' && styles.activeTabIcon]}>🛒</Text>
            {totalCartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCartCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  contentContainer: { flex: 1 },
  header: {paddingBottom: 15,flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',},
  smallTitle: { fontSize: 14, color: colors.dim, marginBottom: 4 },
  title: { fontSize: 25, fontWeight: '700', color: colors.text },
  profileButton: {width: 45,height: 45,borderRadius: 23,backgroundColor: colors.card,
    borderWidth: 1,borderColor: colors.border,justifyContent: 'center',alignItems: 'center',},
  profileIcon: { fontSize: 20 },
    searchContainer: {flexDirection: 'row',alignItems: 'center',backgroundColor: colors.card,
    borderRadius: 14,borderWidth: 1,borderColor: colors.border,paddingHorizontal: 14,
    height: 48,    marginBottom: 20,  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  clearSearchText: { fontSize: 16, color: colors.dim, paddingHorizontal: 5 },
    searchResultsContainer: { gap: 12 },
  menuCard: {    minHeight: 80,    backgroundColor: colors.card,    borderRadius: 16,borderWidth: 1,    
    borderColor: colors.border,padding: 16,flexDirection: 'row',alignItems: 'center',},
  menuInfo: { flex: 1 },  
  menuName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  menuPrice: { fontSize: 15, fontWeight: '600', color: colors.cyan },
  addButton: {width: 36,height: 36,borderRadius: 18,backgroundColor: colors.cyan,justifyContent: 'center',alignItems: 'center',},
  addText: { color: colors.card, fontSize: 22, fontWeight: '500', lineHeight: 24 },
  notFoundText: { textAlign: 'center', color: colors.dim, fontSize: 15, marginTop: 30 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: colors.text, marginBottom: 16 },
  categoryContainer: { gap: 14 },
  categoryCard: {minHeight: 100,backgroundColor: colors.card,borderRadius: 18,borderWidth: 1,    
  borderColor: colors.border,padding: 16,flexDirection: 'row',alignItems: 'center',  },
  iconBox: {width: 62,height: 62,borderRadius: 16,backgroundColor: '#F3EEE7',
  justifyContent: 'center',    alignItems: 'center',marginRight: 15,},
  categoryIcon: { fontSize: 31 },
  categoryText: { flex: 1 },
  categoryTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 4 },
  categorySubtitle: { fontSize: 13, color: colors.dim },
  arrow: { fontSize: 30, color: colors.dim, fontWeight: '300' },
  bottomTab: {flexDirection: 'row',height: 65,backgroundColor: colors.card,
  borderTopWidth: 1,borderColor: colors.border,paddingBottom: 5,},
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabIcon: { fontSize: 22, opacity: 0.5 },
  activeTabIcon: { opacity: 1 },
  tabText: { fontSize: 12, color: colors.dim, marginTop: 2 },
  activeTabText: { color: colors.cyan, fontWeight: '700' },
  badge: {position: 'absolute',right: -10,top: -4,backgroundColor: '#FF3B30',
  borderRadius: 10,minWidth: 18,height: 18,justifyContent: 'center',
  alignItems: 'center',paddingHorizontal: 4,},
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
});
export default HomeScreen;
