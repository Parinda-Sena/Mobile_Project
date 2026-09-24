import { StatusBar } from 'expo-status-bar';
import {
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ระบบหลังร้าน
      </Text>

      <Button
        title="รายการที่ต้องทำ"
        onPress={() => navigation.navigate('OrderList')}
      />

      <View style={styles.space} />

      <Button
        title="การเปลี่ยนสถานะ"
        onPress={() => navigation.navigate('Status')}
      />

      <View style={styles.space} />

      <Button
        title="สรุปยอดขาย"
        onPress={() => navigation.navigate('SalesSummary')}
      />

      <StatusBar style="auto" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FBF9F5',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#3D3731',
  },

  space: {
    height: 16,
  },
});

export default HomeScreen;