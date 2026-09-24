import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const KitchenHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>เมนูระบบหลังร้าน</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('OrderList')}
      >
        <Text style={styles.buttonText}>1. รายการที่ต้องทำ</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Status')}
      >
        <Text style={styles.buttonText}>2. การเปลี่ยนสถานะ</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SalesSummary')}
      >
        <Text style={styles.buttonText}>3. สรุปยอดขาย</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FBF9F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#3D3731' },
  button: { backgroundColor: '#A0826C', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default KitchenHomeScreen;