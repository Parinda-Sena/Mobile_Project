import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../styles/Theme';

const TopMenuScreen = ({ navigation }) => {
  const db = useSQLiteContext();

  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);

  const [topMenus, setTopMenus] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerType, setPickerType] = useState('start');

  // แปลงวันที่เป็น วัน/เดือน/ปี
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // แปลงวันที่เป็นรูปแบบที่ใช้ค้นหาใน SQLite
  const formatSqlDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // เปิดปฏิทิน
  const openDatePicker = (type) => {
    setPickerType(type);
    setShowDatePicker(true);
  };

  // เมื่อเลือกวันที่จากปฏิทิน
  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      if (pickerType === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }

    setShowDatePicker(false);
  };

  // ค้นหา 10 เมนูขายดี
  const searchTopMenus = async () => {
    try {
      if (startDate > endDate) {
        Alert.alert(
          'วันที่ไม่ถูกต้อง',
          'วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด'
        );

        return;
      }

      const start = formatSqlDate(startDate);
      const end = formatSqlDate(endDate);

      const data = await db.getAllAsync(
        `
        SELECT
          m.menu_id,
          m.name AS menu_name,
          SUM(oi.quantity) AS quantity,
          SUM(
            oi.quantity * oi.order_item_price
          ) AS total
        FROM bills b
        JOIN orders o
          ON b.bills_id = o.bills_id
        JOIN order_item oi
          ON o.order_id = oi.order_id
        JOIN menu m
          ON oi.menu_id = m.menu_id
        WHERE b.bills_status = 'closed'
          AND date(b.closed_at, 'localtime') >= date(?)
          AND date(b.closed_at, 'localtime') <= date(?)
          AND oi.order_item_status != 'cancel'
        GROUP BY
          m.menu_id,
          m.name
        ORDER BY
          quantity DESC,
          m.name ASC
        LIMIT 10
        `,
        [start, end]
      );

      setTopMenus(data || []);
    } catch (error) {
      console.error('Top menu error:', error);
    }
  };

  return (
    <View style={styles.container}>

      {/* ปุ่มย้อนกลับ */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('SalesSummary')}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>
          ‹ Back
        </Text>
      </TouchableOpacity>

      <FlatList
        data={topMenus}
        keyExtractor={(item) =>
          item.menu_id.toString()
        }
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <>
            <Text style={styles.title}>
              10 อันดับเมนูขายดี
            </Text>

            {/* ส่วนเลือกวันที่ */}
            <View style={styles.dateCard}>

              <Text style={styles.dateTitle}>
                เลือกช่วงวันที่
              </Text>

              <View style={styles.dateRow}>

                {/* วันที่เริ่มต้น */}
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => openDatePicker('start')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateLabel}>
                    วันที่เริ่มต้น
                  </Text>

                  <Text style={styles.dateValue}>
                    {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.toText}>
                  ถึง
                </Text>

                {/* วันที่สิ้นสุด */}
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => openDatePicker('end')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateLabel}>
                    วันที่สิ้นสุด
                  </Text>

                  <Text style={styles.dateValue}>
                    {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>

              </View>

              {/* ปุ่มค้นหา */}
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchTopMenus}
                activeOpacity={0.7}
              >
                <Text style={styles.searchButtonText}>
                  ค้นหา
                </Text>
              </TouchableOpacity>

            </View>

            {/* ปฏิทิน */}
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() =>
                setShowDatePicker(false)
              }
            >
              <View style={styles.modalBackground}>

                <View style={styles.calendarCard}>

                  <View style={styles.calendarHeader}>

                    <Text style={styles.calendarTitle}>
                      {pickerType === 'start'
                        ? 'เลือกวันที่เริ่มต้น'
                        : 'เลือกวันที่สิ้นสุด'}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setShowDatePicker(false)
                      }
                    >
                      <Text style={styles.closeText}>
                        ปิด
                      </Text>
                    </TouchableOpacity>

                  </View>

                  <DateTimePicker
                    value={
                      pickerType === 'start'
                        ? startDate
                        : endDate
                    }
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                  />

                </View>

              </View>
            </Modal>

            {/* กรณียังไม่มีข้อมูล */}
            {topMenus.length === 0 && (
              <Text style={styles.noDataText}>
                ยังไม่มีข้อมูลในช่วงวันที่เลือก
              </Text>
            )}
          </>
        }

        // แสดงแต่ละอันดับ
        renderItem={({ item, index }) => (
          <View style={styles.rankCard}>

            {/* อันดับ */}
            <View style={styles.rankNumber}>
              <Text style={styles.rankNumberText}>
                {index + 1}
              </Text>
            </View>

            {/* ชื่อเมนู */}
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>
                {item.menu_name}
              </Text>

              <Text style={styles.rankDetail}>
                ขาย {item.quantity} รายการ
              </Text>
            </View>

            {/* ยอดขายของเมนู */}
            <Text style={styles.rankTotal}>
              {item.total} บาท
            </Text>

          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    paddingTop: 50,
  },

  backBtn: {
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingTop: 8,
  },

  backText: {
    fontSize: 18,
    color: colors.text,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  dateCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  dateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateButton: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
  },

  dateLabel: {
    fontSize: 12,
    color: colors.dim,
    marginBottom: 5,
  },

  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  toText: {
    marginHorizontal: 8,
    color: colors.dim,
    fontSize: 13,
  },

  searchButton: {
    marginTop: 12,
    backgroundColor: colors.text,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },

  searchButtonText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '600',
  },

  rankCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rankNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  rankNumberText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },

  rankInfo: {
    flex: 1,
  },

  rankName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  rankDetail: {
    fontSize: 13,
    color: colors.dim,
    marginTop: 3,
  },

  rankTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },

  noDataText: {
    color: colors.dim,
    fontSize: 14,
    marginBottom: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  calendarCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    alignItems: 'center',
  },

  calendarHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  calendarTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },

  closeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

});

export default TopMenuScreen;