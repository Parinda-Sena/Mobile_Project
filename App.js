import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { DATABASE_NAME, initDatabase } from './src/database/db';

const colors = {
  bg: '#FBF9F5',
  card: '#FFFFFF',
  border: '#E6DFD5',
  text: '#3D3731',
  dim: '#8C827A',
  cyan: '#A0826C',
};

function WelcomeScreen({ onStart }) {
  const handleStaffLogin = () => {
    Alert.alert('Staff Login', 'หน้าสำหรับพนักงานเข้าสู่ระบบ');
  };

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        style={styles.staffButton}
        onPress={handleStaffLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.staffIcon}>●</Text>
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <Text style={styles.welcomeText}>Welcome to meow restaurant</Text>
        <Text style={styles.subtitle}>Click to start</Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen() {
  const db = useSQLiteContext();
  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    Dessert: '🍰',
    Beverage: '🥤',
    'Main Course': '🍛',
    Appetizers: '🥗',
  };

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const result = await db.getAllAsync('SELECT * FROM category');
        if (isMounted) {
          setCategories(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) setLoading(false);
      }
    };

    loadCategories();
    return () => { isMounted = false; };
  }, [db]);

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Welcome</Text>
          <Text style={styles.title}>What would you like?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'home' && (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Menu Categories</Text>

          {loading ? (
            <ActivityIndicator size="small" color={colors.cyan} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.categoryContainer}>
              {categories.map((item) => (
                <TouchableOpacity key={item.category_id} style={styles.categoryCard} activeOpacity={0.8}>
                  <View style={styles.iconBox}>
                    <Text style={styles.categoryIcon}>{categoryIcons[item.category_name] || '🍽️'}</Text>
                  </View>
                  <View style={styles.categoryText}>
                    <Text style={styles.categoryTitle}>{item.category_name}</Text>
                    <Text style={styles.categorySubtitle}>View menu</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {activeTab === 'favorite' && (
        <View style={styles.emptyPage}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Favorite Menu</Text>
          <Text style={styles.emptyText}>เมนูที่คุณกดถูกใจจะแสดงที่นี่</Text>
        </View>
      )}

      {activeTab === 'cart' && (
        <View style={styles.emptyPage}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart</Text>
          <Text style={styles.emptyText}>รายการอาหารที่เลือกจะแสดงที่นี่</Text>
        </View>
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.navIcon, activeTab === 'home' && styles.activeNavIcon]}>⌂</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>หน้าหลัก</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('favorite')}>
          <Text style={[styles.navIcon, activeTab === 'favorite' && styles.activeNavIcon]}>♡</Text>
          <Text style={[styles.navText, activeTab === 'favorite' && styles.activeNavText]}>Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('cart')}>
          <Text style={[styles.navIcon, activeTab === 'cart' && styles.activeNavIcon]}>🛒</Text>
          <Text style={[styles.navText, activeTab === 'cart' && styles.activeNavText]}>ตะกร้า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// แยกส่วนสลับหน้าจอออกเป็น Component เพื่อเรียกใช้ useSQLiteContext
function MainContent() {
  const [screen, setScreen] = useState('welcome');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      {screen === 'welcome' ? (
        <WelcomeScreen onStart={() => setScreen('home')} />
      ) : (
        <HomeScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SQLiteProvider 
      databaseName={DATABASE_NAME} 
      onInit={initDatabase}
      useSuspense={false} // ✅ ปิด Suspense ป้องกันวงกลมหมุนค้าง
    >
      <MainContent />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44 },
  screenContainer: { flex: 1 },
  staffButton: { position: 'absolute', top: 16, right: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  staffIcon: { fontSize: 20, color: colors.cyan },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  welcomeText: { fontSize: 42, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.dim, marginBottom: 35 },
  startButton: { width: 180, height: 52, borderRadius: 26, backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center' },
  startText: { fontSize: 18, fontWeight: '700', color: colors.card },
  header: { paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallTitle: { fontSize: 14, color: colors.dim, marginBottom: 4 },
  title: { fontSize: 25, fontWeight: '700', color: colors.text },
  profileButton: { width: 45, height: 45, borderRadius: 23, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { fontSize: 20 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 30 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: colors.text, marginBottom: 16 },
  categoryContainer: { gap: 14 },
  categoryCard: { minHeight: 100, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 62, height: 62, borderRadius: 16, backgroundColor: '#F3EEE7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  categoryIcon: { fontSize: 31 },
  categoryText: { flex: 1 },
  categoryTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 4 },
  categorySubtitle: { fontSize: 13, color: colors.dim },
  arrow: { fontSize: 30, color: colors.dim, fontWeight: '300' },
  emptyPage: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyIcon: { fontSize: 55, color: colors.cyan, marginBottom: 15 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.dim, textAlign: 'center' },
  bottomNavigation: { height: 75, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 23, color: colors.dim, marginBottom: 3 },
  activeNavIcon: { color: colors.cyan },
  navText: { fontSize: 12, color: colors.dim },
  activeNavText: { color: colors.cyan, fontWeight: '700' },
});
