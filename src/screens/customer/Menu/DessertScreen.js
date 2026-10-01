import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../../styles/Theme';

const MENU_IMAGES = {
  'Chocolate Bingsu': 'https://shopee.co.th/blog/wp-content/uploads/2022/02/E6OnzwWXsAIE3s1-1.jpg',
  'Honey Toast': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-iyOgfMr5mFAQHxDCUa2PxWKM7VtaHNv3eAe2LyZUOFoYpG4BnK0wC1E&s=10',
  'Macarons': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWktYk45-oYq7S2BXTmOpNQXkyBlnAjs6522NuQQJXjHcOnQAfImenOw5&s=10',
  'Blueberry Cheesecake': 'https://www.calforlife.com/image/food/Blueberry-Cheesecake.jpg',
  'Banoffee Pie': 'https://sprouted-seeds.com/wp-content/uploads/2021/08/S__250593392.jpg',
  'Strawberry Bingsu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TT4Q501KbyMhCTtpv2xBIWgaZ_3JV53-5x5WnRRmOIHjzYQg5d2GWelE&s=10',
  'Orange Cake': 'https://api2.krua.co/wp-content/uploads/2025/01/ArticlePic_1670x1095_Artboard-1-16-scaled.jpg',
  'Brownie': 'https://img.wongnai.com/p/1920x0/2025/04/07/11282c9ca2eb42af9b46ff2119fbb933.jpg',
  'Oreo Bingsu': 'https://img.wongnai.com/p/400x0/2020/05/04/ca1cf4d65693470287c35fff3f0e6038.jpg',
  'Volcano Bingsu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVrBEMXvWri3hm013kvpaGc3oOFDJGea_NGgM383tiXbfNiuOUdRrG_-3v&s=10',
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

function DessertScreen({ onBack, onAddToCart }) {
  const db = useSQLiteContext();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMenu() {
      try {
        const result = await db.getAllAsync(
          `
          SELECT
            menu_id,
            name,
            price,
            category_id,
            available
          FROM menu
          WHERE category_id = ?
          ORDER BY menu_id
          `,
          ['C001']
        );

        if (isMounted) {
          setMenuItems(result || []);
        }
      } catch (error) {
        console.error('Error loading desserts:', error);
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

        <Text style={styles.title}>Desserts</Text>
        <Text style={styles.subtitle}>ของหวาน</Text>
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
                <Image
                  source={{ uri: MENU_IMAGES[item.name] || DEFAULT_IMAGE }}
                  style={styles.menuImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.price}>{item.price} ฿</Text>
              </View>

              {item.available === 1 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.7}
                  onPress={() => onAddToCart && onAddToCart(item)}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.soldOutButton}>
                  <Text style={styles.soldOutText}>หมด</Text>
                </View>
              )}
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
  soldOutButton: { width: 50, height: 38, borderRadius: 19, backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center' },
  soldOutText: { color: colors.card, fontSize: 13, fontWeight: '600' },
});

export default DessertScreen;