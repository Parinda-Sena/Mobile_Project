import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../../styles/Theme';

const MENU_IMAGES = {
  'Pure Matcha': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSezGUcdksLE12ylTP0OFRi_0K-jtxMtm8Oya_ey3sPvzH8_EQDeAHqi0I&s=10',
  'Matcha Latte': 'https://www.finedininglovers.com/sites/default/files/styles/1_1_768x768/public/2026-02/matcha-latte.jpg.webp?h=4963bdfc&itok=PdfRJCgX',
  'Strawberry Fresh Milk': 'https://streetsmartnutrition.com/wp-content/uploads/2022/07/IMG_6612.jpg',
  'Coke': 'https://media.istockphoto.com/id/458464735/photo/coke.jpg?s=612x612&w=0&k=20&c=YbmiazMmY0DkWh_W8T0pBkOgai2k62hGF1TJn9EC5W0=',
  'Water': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpJm7ZZbDgEAxmIDEpHZHKTDjpKoGgRZ5EDLneDhfjIiJ53qMlCXobFP09&s=10',
  'Cocoa Frappe': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaQdbRX7EP-VenUEjFyF-E--AsReVAcnf96kR_oAVOYpSLjFantqAU-Ug&s=10',
  'Iced Cocoa': 'https://www.cacaobrew.co.uk/cdn/shop/articles/Iced_Chocolate2_bc38211b-194b-4ae7-9c8f-75e5cbb96100.jpg?v=1754420953',
  'Blue Hawaii': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp3sa3F82Tr1QxDaiTVpKYJpwyXY0hIDpAYFydBSAPTpHAQVGotO4smctM&s=10',
  'Latte': 'https://www.cuisinart.com/dw/image/v2/ABAF_PRD/on/demandware.static/-/Sites-us-cuisinart-sfra-Library/default/dw42dcae51/images/recipe-Images/cafe-latte1-recipe_resized.jpg?sw=1200&sh=1200&sm=fit',
  'Cappucino': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKgae6KFiwdV6y8vN2-3fbxLV5aGzwZ398Q9fhQJeFu7MCbLo5j3vQk2Vw&s=10',
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

function DrinkScreen({ onBack, onAddToCart }) {
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
          ['C002']
        );

        if (isMounted) {
          setMenuItems(result || []);
        }
      } catch (error) {
        console.error('Error loading beverages:', error);
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

        <Text style={styles.title}>Beverages</Text>
        <Text style={styles.subtitle}>น้ำดื่ม</Text>
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

export default DrinkScreen;
