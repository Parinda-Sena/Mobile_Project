import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../../styles/Theme';
import { getMenuItemsByCategory } from '../../../database/db';

const MENU_IMAGES = {
  'Ommlette on Rice': 'https://s359.kapook.com/pagebuilder/4854bb38-8906-4f15-9684-172c873d305f.jpg',
  'Tom Yum Goong': 'https://ptkss.com/wp-content/uploads/2025/10/%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%A2%E0%B8%B3%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87.png',
  'American Fried Rice': 'https://img.kapook.com/u/pirawan/Cooking1/americanfriedrice.jpg',
  'Pork Steak': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQccO7bGVdZB_NVUl3QDvx_aOOKqKGq5Jz2KTICAg-TH1RuEFyD2XhaKwda&s=10',
  'Beef Steak': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThExAlN28ZEQqYQoX-LSnlxrf3lpsFB8TpvWb-JsyTWYF-pAcZSnqKco8&s=10',
  'Spaghetti with Spicy Seafood': 'https://s359.kapook.com/pagebuilder/19910966-cc8c-4be8-ad45-b90915bdb54a.jpg',
  'Spaghetti Carbonara': 'https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/25/2022/03/pasta-spaghetti-Carbonara.jpg?width=700&quality=95',
  'Stir-Fried Basil with Minced Pork on Rice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCiJmeeNs0zF1_mPggVhRQYOSdAJDeiFmnVgNUqrbfBvnPpCsuxhlG8M&s=10',
  'Pork Fried Rice': 'https://s359.kapook.com/pagebuilder/2810e9c2-ac36-4970-bc50-d2fa431e2c3c.jpg',
  'Deep-Fried Seabass with Fish Sauce': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnwgEBpHJgjT2232PL0xWOpi_OC97Lj-9aazxQQpRmOFFk2fcSixhgNKU&s=10',
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

function MainCourseScreen({ onBack, onAddToCart }) {
  const db = useSQLiteContext();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMenu() {
      try {
        // ดึงข้อมูล Main Course (category_id = 'C003')
        const result = await getMenuItemsByCategory(db, 'C003');

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
  }, [db]);

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

export default MainCourseScreen;
