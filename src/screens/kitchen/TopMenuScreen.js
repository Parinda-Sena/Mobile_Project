import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/Theme';

const TopMenuScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDate, setEndDate] = useState(today);
  const [topMenus, setTopMenus] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerType, setPickerType] = useState('start');
  const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const formatSqlDate = (d) => d.toISOString().split('T')[0];
  const handleDateChange = (event, selectedDate) => {
    if (event.type !== 'dismissed' && selectedDate) {
      pickerType === 'start' ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
    setShowDatePicker(false);
  };
  const searchTopMenus = async () => {
    if (startDate > endDate) return Alert.alert('วันที่ไม่ถูกต้อง', 'วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด');
    try {
      const data = await db.getAllAsync(
        `SELECT m.menu_id, m.name AS menu_name, SUM(oi.quantity) AS quantity, SUM(oi.quantity * oi.order_item_price) AS total
         FROM bills b
         JOIN orders o ON b.bills_id = o.bills_id
         JOIN order_item oi ON o.order_id = oi.order_id
         JOIN menu m ON oi.menu_id = m.menu_id
         WHERE b.bills_status = 'closed'
           AND date(b.closed_at, 'localtime') >= date(?)
           AND date(b.closed_at, 'localtime') <= date(?)
           AND oi.order_item_status != 'cancel'
         GROUP BY m.menu_id, m.name
         ORDER BY quantity DESC, m.name ASC LIMIT 10`,
        [formatSqlDate(startDate), formatSqlDate(endDate)]
      );
      setTopMenus(data || []);
    } catch (error) {
      console.error('Top menu error:', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => navigation.navigate('SalesSummary')} activeOpacity={0.7}>
        <Text style={{ fontSize: 18, color: colors.text }}>‹ Back</Text>
      </TouchableOpacity>
      <FlatList
        data={topMenus}
        keyExtractor={(item) => item.menu_id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>10 อันดับเมนูขายดี</Text>
            <View style={styles.dateCard}>
              <Text style={styles.boldText}>เลือกช่วงวันที่</Text>
              <View style={styles.rowCenter}>
                <TouchableOpacity style={styles.dateBtn} onPress={() => { setPickerType('start'); setShowDatePicker(true); }}>
                  <Text style={styles.subText}>วันที่เริ่มต้น</Text>
                  <Text style={styles.boldText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8, color: colors.dim, fontSize: 13 }}>ถึง</Text>
                <TouchableOpacity style={styles.dateBtn} onPress={() => { setPickerType('end'); setShowDatePicker(true); }}>
                  <Text style={styles.subText}>วันที่สิ้นสุด</Text>
                  <Text style={styles.boldText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.searchBtn} onPress={searchTopMenus} activeOpacity={0.7}>
                <Text style={{ color: colors.bg, fontSize: 15, fontWeight: '600' }}>ค้นหา</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
              <View style={styles.modalBg}>
                <View style={styles.calendarCard}>
                  <View style={[styles.rowCenter, { width: '100%', justifyContent: 'space-between', marginBottom: 10 }]}>
                    <Text style={styles.title}>{pickerType === 'start' ? 'เลือกวันที่เริ่มต้น' : 'เลือกวันที่สิ้นสุด'}</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.boldText}>ปิด</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={pickerType === 'start' ? startDate : endDate}
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                  />
                </View>
              </View>
            </Modal>
            {topMenus.length === 0 && <Text style={styles.subText}>ยังไม่มีข้อมูลในช่วงวันที่เลือก</Text>}
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.rankCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.boldText}>{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.boldText}>{item.menu_name}</Text>
              <Text style={styles.subText}>ขาย {item.quantity} รายการ</Text>
            </View>
            <Text style={[styles.boldText, { marginLeft: 8 }]}>{item.total} บาท</Text>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  boldText: { fontSize: 15, fontWeight: '600', color: colors.text },
  subText: { fontSize: 13, color: colors.dim, marginTop: 2 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  dateCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 14, gap: 10 },
  dateBtn: { flex: 1, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10 },
  searchBtn: { backgroundColor: colors.text, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  rankCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  calendarCard: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, alignItems: 'center' },
});
export default TopMenuScreen;