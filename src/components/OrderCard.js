import React from 'react';
import { View, Text } from 'react-native';
import { kitchenStyles } from '../styles/kitchenStyles'; // หรือ path ตามโครงสร้างโปรเจกต์ของคุณ

const OrderCard = ({ item, children }) => {
  return (
    <View style={kitchenStyles.card}>
      <View style={kitchenStyles.headerRow}>
        <Text style={kitchenStyles.tableTitle}>โต๊ะ {item.tables_number}</Text>
        <Text style={kitchenStyles.orderCode}>{item.order_item_id}</Text>
      </View>

      <Text style={kitchenStyles.menuTitle}>{item.menu_name}</Text>

      <Text style={kitchenStyles.labelTitle}>จำนวน {item.quantity} รายการ</Text>

      <Text style={kitchenStyles.labelTitle}>โต๊ะ</Text>
      <Text style={kitchenStyles.valueText}>{item.tables_number}</Text>

      <Text style={kitchenStyles.labelTitle}>รอบที่</Text>
      <Text style={kitchenStyles.valueText}>{item.round}</Text>

      <Text style={kitchenStyles.labelTitle}>เวลา</Text>
      <Text style={kitchenStyles.valueText}>{item.ordered_at}</Text>

      {/* Render StatusDropdown */}
      {children}

      {/* 📌 ส่วนแสดงหมายเหตุ: จะแสดงผลเฉพาะเมื่อมีข้อความพิมพ์มาเท่านั้น */}
      {!!(item.note || item.order_item_note) && (
        <View style={kitchenStyles.noteBox}>
          <Text style={kitchenStyles.noteText}>
            📝 หมายเหตุ: {item.note || item.order_item_note}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrderCard;
