import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../../styles/Theme';
import { getMenuItemsByCategory } from '../../../database/db';

const MENU_IMAGES = {
  'Shrimp Donut': 'https://www.dailynews.co.th/wp-content/uploads/2022/05/2-1-1.jpg',
  'French Fries': 'https://img.magnific.com/free-photo/fried-potatoes-with-ketchup-mayonnaise-isolated-white-background_123827-21724.jpg?semt=ais_hybrid&w=740&q=80',
  'Chicken Nuggets': 'https://fit-d.com/uploads/food/cdfe567fab5d89ed634629e91fc8eb5c.jpg',
  'Chicken Pop': 'https://png.pngtree.com/png-clipart/20250224/original/pngtree-crispy-fried-chicken-pieces-falling-on-paper-plate-png-image_20507209.png',
  'Egg Tart': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS05ht211s37lQ5p7IkhBnmnugbndZWkbI17Whs0AzfOMQv5SinY9Qb2vD2&s=10',
  'Wingz Zabb': 'https://obs-ect.line-scdn.net/r/ect/ect/cj02dGI5dHZrb3M0aWZ2JnM9anA2JnQ9bSZ1PTFmdmM4YnN1azRkZzAmaT0w',
  'Cream of Truffle Mushroom Soup': 'https://www.greengenelife.com/wp-content/uploads/2024/09/Truffle-mushroom-soup-1.jpg',
  'Toast': 'https://png.pngtree.com/png-clipart/20240814/original/pngtree-three-slices-of-toasted-bread-stacked-vertically-png-image_15771956.png',
  'Spinach with Cheese': 'https://cuisineyimyai.wordpress.com/wp-content/uploads/2014/10/1385949783-image-o.jpg?w=640',
  'Lasagna': 'https://aroifin.com/wp-content/uploads/2025/12/17122025-lasagna-cover.webp',
};

function AppetizerScreen({ onBack, onAddToCart }) {
  const db = useSQLiteContext();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 

    async function fetchMenu() {
      try {
        const result = await getMenuItemsByCategory(db, 'C004');

        if (isMounted) {
          setMenuItems(result);
        }
      } catch (error) {
        console.error('Error loading appetizers:', error);
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
  }, [db]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && ( 
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
            <Text style={styles.backText}>‹ Back</Text> 
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Appetizers</Text>
        <Text style={styles.subtitle}>อาหารเรียกน้ำย่อย</Text>
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
                <Image source={{ uri: MENU_IMAGES[item.name] || DEFAULT_IMAGE }} 
                  style={styles.menuImage} resizeMode="cover" />
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
  imageBox: { width: 68, height: 68, borderRadius: 15, backgroundColor: '#F3EEE7', overflow: 'hidden' },
  menuImage: { width: '100%', height: '100%' },
  info: { flex: 1, marginLeft: 15 },
  menuName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '600', color: colors.cyan },
  addButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center' },
  addText: { color: colors.card, fontSize: 25, fontWeight: '500', lineHeight: 27 },
});

export default AppetizerScreen;
