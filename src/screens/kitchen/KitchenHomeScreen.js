import React from 'react';
import { StatusBar } from 'expo-status-bar'; 
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; // 👈 แก้ไขจุดนี้
import { useSQLiteContext } from 'expo-sqlite'; 
import { resetDatabase } from '../../database/db'; 

const KitchenHomeScreen = ({ navigation }) => { 
  const db = useSQLiteContext(); 
  const handleResetDatabase = async () => {
    Alert.alert( "ยืนยันการล้างข้อมูลร้าน", "การกระทำนี้จะล้างออเดอร์และรีเซ็ตข้อมูลทั้งหมด คุณแน่ใจหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ยืนยันล้างข้อมูล", style: "destructive", onPress: async () => {
            try {
              await resetDatabase(db); 
              Alert.alert("สำเร็จ", "รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว");
            } catch (error) {
              console.error(error);
              Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถรีเซ็ตฐานข้อมูลได้");
            }
          } 
        }
      ]
    );
  };

  return ( 
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" /> 
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Login')}> 
          <Text style={styles.backText}>‹ Back</Text> 
        </TouchableOpacity> 
        <Text style={styles.title}>ระบบหลังร้าน</Text>
        <Text style={styles.subtitle}>จัดการรายการและระบบร้านอาหาร</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('OrderList')}>
            <View style={[styles.iconBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.cardIcon}>📋</Text>
            </View>
            <Text style={styles.cardTitle}>รายการที่ต้องทำ</Text>
            <Text style={styles.cardSub}>ตรวจสอบออเดอร์ใหม่</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('Status')} >
            <View style={[styles.iconBadge, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.cardIcon}>🔄</Text>
            </View>
            <Text style={styles.cardTitle}>เปลี่ยนสถานะ</Text>
            <Text style={styles.cardSub}>อัปเดตสถานะอาหาร</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('SalesSummary')}>
            <View style={[styles.iconBadge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.cardIcon}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>สรุปยอดขาย</Text>
            <Text style={styles.cardSub}>ดูรายงานรายวัน</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('MenuManagement')} >
            <View style={[styles.iconBadge, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.cardIcon}>🍔</Text>
            </View>
            <Text style={styles.cardTitle}>จัดการเมนู</Text>
            <Text style={styles.cardSub}>เพิ่ม/แก้ไขรายการ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.resetButton} activeOpacity={0.8}onPress={handleResetDatabase} >
            <Text style={styles.resetIcon}>🗑️</Text>
            <Text style={styles.resetButtonText}>ล้างข้อมูลฐานข้อมูล (Reset DB)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView> 
  ); 
}; 

const styles = StyleSheet.create({ 
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#EAEAEA', marginBottom: 16 }, 
  backText: { fontSize: 14, fontWeight: '600', color: '#555' }, 
  title: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50' }, 
  subtitle: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 }, 
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconBadge: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#95A5A6' },
  dangerZone: { marginTop: 12 },
  resetButton: { flexDirection: 'row', backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resetIcon: { fontSize: 16, marginRight: 8 },
  resetButtonText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 },
});

export default KitchenHomeScreen;
