import { StatusBar } from 'expo-status-bar'; 
import { Alert, Button, StyleSheet,Text, TouchableOpacity, View, } from 'react-native'; 
import { useSQLiteContext } from 'expo-sqlite'; 
import { resetDatabase } from '../../database/db'; 
const KitchenHomeScreen = ({ navigation }) => { 
const db = useSQLiteContext(); 
const handleResetDatabase = async () => {
    Alert.alert( "ยืนยันการล้างข้อมูลร้าน","การกระทำนี้จะล้างออเดอร์และรีเซ็ตข้อมูลทั้งหมด คุณแน่ใจหรือไม่?",
      [{ text: "ยกเลิก", style: "cancel" },{text: "ยืนยันล้างข้อมูล",style: "destructive",onPress: async () => {
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
    <View style={styles.container}> 
       <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Login')}> 
        <Text style={styles.backText}>‹ Back</Text> 
      </TouchableOpacity> 
       <Text style={styles.title}>ระบบหลังร้าน</Text>  
      <Button title="รายการที่ต้องทำ" color="#698269" onPress={() => navigation.navigate('OrderList')} /> 
      <View style={styles.space} /> 
      <Button title="การเปลี่ยนสถานะ" color="#698269"  onPress={() => navigation.navigate('Status')} /> 
      <View style={styles.space} /> 
      <Button title="สรุปยอดขาย" color="#698269" onPress={() => navigation.navigate('SalesSummary')} />
      <View style={styles.space} /> 
      <Button title="ล้างข้อมูลฐานข้อมูล (Reset DB)" color="#d9534f" onPress={handleResetDatabase} /> 
      <StatusBar style="auto" /> 
    </View> 
  ); 
}; 
 const styles = StyleSheet.create({ 
  container: {flex: 1,justifyContent: 'center',padding: 24,backgroundColor: '#FBF9F5',   }, 
  title: {fontSize: 28,fontWeight: 'bold',textAlign: 'center',marginBottom: 30,color: '#3D3731',}, 
  space: {height: 16,}, 
  backBtn: {position: 'absolute',top: 50,left: 16,zIndex: 10,}, 
  backText: {fontSize: 18,color: '#3D3731',}, 
}); 
 
export default KitchenHomeScreen;
