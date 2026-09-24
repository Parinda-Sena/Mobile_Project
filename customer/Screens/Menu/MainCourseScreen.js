import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as SQLite from 'expo-sqlite';
import colors from '../../components/theme';

const DATABASE_NAME = 'my_restaurant.db';

const MENU_ICONS = { 
  'Ommlette on Rice': '🍳',
  'Tom Yum Goong': '🍲',
  'American Fried Rice': '🍛',
  'Pork Steak': '🥩',
  'Beef Steak': '🥩',
  'Spaghetti with Spicy Seafood': '🍝',
  'Spaghetti Carbonara': '🍝',
  'Stir-Fried Basil with Minced Pork on Rice': '🍛',
  'Pork Fried Rice': '🍚',
  'Deep-Fried Seabass with Fish Sauce': '🐟',
};

function MainCourseScreen({ onBack, onAddToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMenu() {
      try {
        const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        
        // ดึงเฉพาะเมนูที่เป็น Main Course (category_id = 'C003')
        const result = await db.getAllAsync(
          'SELECT menu_id, name, price, category_id FROM menu WHERE category_id = ?',
          ['C003']
        );

        if (isMounted) {
          setMenuItems(result);
        }
      } catch (error) {
        console.error('Error loading main courses:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Main Course</Text>
        <Text style={styles.subtitle}>อาหารจานหลัก</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.cyan} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <View key={item.menu_id} style={styles.menuCard}>
              <View style={styles.imageBox}>
                <Text style={styles.icon}>{MENU_ICONS[item.name] || '🍛'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.price}>{item.price} ฿</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                activeOpacity={0.7}
                onPress={() => onAddToCart && onAddToCart(item)}
              >
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 24, paddingTop: 45, paddingBottom: 15 },
  backButton: { marginBottom: 8 },
  backText: { fontSize: 16, color: colors.cyan, fontWeight: '600' },
  title: { fontSize: 27, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuContainer: { paddingHorizontal: 24, paddingBottom: 30, gap: 12 },
  menuCard: { minHeight: 90, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center' },
  imageBox: { width: 68, height: 68, borderRadius: 15, backgroundColor: '#F3EEE7', justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 34 },
  info: { flex: 1, marginLeft: 15 },
  menuName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '600', color: colors.cyan },
  addButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center' },
  addText: { color: colors.card, fontSize: 25, fontWeight: '500', lineHeight: 27 },
});

export default MainCourseScreen;
