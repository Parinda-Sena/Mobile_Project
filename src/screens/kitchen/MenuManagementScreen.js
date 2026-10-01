import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../styles/Theme';

const CATEGORIES = [
  { id: 'C001', name: 'ของหวาน' },
  { id: 'C002', name: 'เครื่องดื่ม' },
  { id: 'C003', name: 'อาหารจานหลัก' },
  { id: 'C004', name: 'อาหารเรียกน้ำย่อย' },
];

const MenuManagementScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [selectedCategory, setSelectedCategory] = useState('C003');
  const [menus, setMenus] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const loadMenus = async () => {
    try {
      const data = await db.getAllAsync(
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
        [selectedCategory]
      );

      setMenus(data || []);
    } catch (error) {
      console.error('Load menu error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลเมนูได้');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMenus();
    }, [db, selectedCategory])
  );

  const handleToggleAvailable = async (item) => {
    try {
      const newStatus = item.available === 1 ? 0 : 1;

      await db.runAsync(
        `
        UPDATE menu
        SET available = ?
        WHERE menu_id = ?
        `,
        [newStatus, item.menu_id]
      );

      await loadMenus();
    } catch (error) {
      console.error('Update menu status error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะเมนูได้');
    }
  };

  const openPriceModal = (item) => {
    setSelectedMenu(item);
    setNewPrice(String(item.price));
    setShowPriceModal(true);
  };

  const closePriceModal = () => {
    setShowPriceModal(false);
    setSelectedMenu(null);
    setNewPrice('');
  };

  const handleUpdatePrice = async () => {
    if (!selectedMenu) {
      return;
    }

    const price = Number(newPrice);

    if (newPrice.trim() === '' || !Number.isInteger(price) || price < 0) {
      Alert.alert('ราคาไม่ถูกต้อง', 'กรุณาใส่ราคาเป็นจำนวนเต็มตั้งแต่ 0 บาทขึ้นไป');
      return;
    }

    try {
      await db.runAsync(
        `
        UPDATE menu
        SET price = ?
        WHERE menu_id = ?
        `,
        [price, selectedMenu.menu_id]
      );

      closePriceModal();
      await loadMenus();

      Alert.alert(
        'สำเร็จ',
        `เปลี่ยนราคา ${selectedMenu.name} เป็น ${price} บาทแล้ว`
      );
    } catch (error) {
      console.error('Update menu price error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนราคาเมนูได้');
    }
  };

  const renderMenuItem = ({ item }) => {
    const isAvailable = item.available === 1;

    return (
      <View style={styles.menuCard}>
        <View style={styles.menuInfo}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.menuId}>รหัสเมนู: {item.menu_id}</Text>
          <Text style={styles.menuPrice}>{item.price} บาท</Text>
        </View>

        <View style={styles.actionArea}>
          <TouchableOpacity
            style={[styles.statusButton, isAvailable ? styles.availableButton : styles.soldOutButton]}
            onPress={() => handleToggleAvailable(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.statusButtonText}>
              {isAvailable ? 'มีขาย' : 'หมด'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.priceButton}
            onPress={() => openPriceModal(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.priceButtonText}>แก้ไขราคา</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('KitchenHome')}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>จัดการเมนู</Text>
      <Text style={styles.subtitle}>เปลี่ยนสถานะเมนูและแก้ไขราคา</Text>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;

            return (
              <TouchableOpacity
                style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={menus}
        keyExtractor={(item) => item.menu_id}
        renderItem={renderMenuItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีข้อมูลเมนู</Text>}
      />

      <Modal
        visible={showPriceModal}
        transparent
        animationType="fade"
        onRequestClose={closePriceModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>แก้ไขราคา</Text>

            {selectedMenu && (
              <Text style={styles.modalMenuName}>{selectedMenu.name}</Text>
            )}

            <Text style={styles.inputLabel}>ราคาใหม่</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.priceInput}
                value={newPrice}
                onChangeText={setNewPrice}
                keyboardType="numeric"
                placeholder="ใส่ราคา"
                placeholderTextColor={colors.dim}
              />
              <Text style={styles.bahtText}>บาท</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closePriceModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdatePrice}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 50 },
  backBtn: { height: 45, justifyContent: 'center', paddingHorizontal: 5, paddingTop: 8 },
  backText: { fontSize: 18, color: colors.text },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.dim, marginTop: 4, marginBottom: 14 },
  categoryContainer: { marginBottom: 12 },
  categoryList: { paddingRight: 8 },
  categoryButton: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
  categoryButtonActive: { backgroundColor: colors.text, borderColor: colors.text },
  categoryText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  categoryTextActive: { color: colors.bg },
  menuList: { paddingTop: 4, paddingBottom: 20 },
  menuCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  menuInfo: { flex: 1, paddingRight: 10 },
  menuName: { fontSize: 16, fontWeight: '600', color: colors.text },
  menuId: { fontSize: 12, color: colors.dim, marginTop: 4 },
  menuPrice: { fontSize: 15, fontWeight: '600', color: colors.cyan, marginTop: 5 },
  actionArea: { alignItems: 'flex-end', gap: 8 },
  statusButton: { minWidth: 72, borderRadius: 9, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' },
  availableButton: { backgroundColor: colors.green },
  soldOutButton: { backgroundColor: colors.red },
  statusButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  priceButton: { minWidth: 72, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg, borderRadius: 9, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' },
  priceButtonText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: colors.dim, marginTop: 30, fontSize: 14 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 21, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  modalMenuName: { fontSize: 15, color: colors.dim, marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 7 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.bg, paddingHorizontal: 12 },
  priceInput: { flex: 1, height: 45, fontSize: 16, color: colors.text },
  bahtText: { fontSize: 14, color: colors.dim, marginLeft: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18, gap: 10 },
  cancelButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: colors.text },
  saveButton: { backgroundColor: colors.text, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 22 },
  saveButtonText: { fontSize: 14, fontWeight: '600', color: colors.bg },
});

export default MenuManagementScreen;