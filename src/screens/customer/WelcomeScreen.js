import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import colors from '../../styles/Theme';

function WelcomeScreen({ navigation }) {
  
  // กดปุ่ม 3 ขีด ไปหน้า Login พนักงาน
  const handleStaffLogin = () => {
    navigation.navigate('Login'); 
  };

  // กดปุ่ม Start ไปหน้าหลักลูกค้า
  const handleStart = () => {
  navigation.navigate('Table');
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      {/* ปุ่มขีด 3 ขีดสำหรับพนักงาน */}
      <TouchableOpacity 
        style={styles.staffButton} 
        onPress={handleStaffLogin} 
        activeOpacity={0.7}
      >
        <Text style={styles.staffIcon}>☰</Text>
      </TouchableOpacity>
      
      <View style={styles.centerContent}>
        <Text style={styles.welcomeText}>Welcome to meow restaurant</Text>
        <Text style={styles.subtitle}>Click to start</Text>

        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStart} 
          activeOpacity={0.8}
        >
          <Text style={styles.startText}>Start</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg,
  },
  staffButton: {
    position: 'absolute', 
    top: 50, // ขยับลงมาจากขอบบนเล็กน้อย เพื่อไม่ให้โดนรูกล้องหรือแถบสถานะบังและกดง่ายขึ้น
    right: 24, 
    width: 48, 
    height: 48, 
    borderRadius: 24,
    backgroundColor: colors.card, 
    borderWidth: 1, 
    borderColor: colors.border, 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 999, // ดึงให้อยู่ชั้นบนสุดเพื่อให้กดติดแน่นอน
    elevation: 5,  // สำหรับ Android เงาและลำดับการกด
  },
  staffIcon: { 
    fontSize: 20, 
    color: colors.cyan, 
    fontWeight: 'bold',
  },
  centerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 30, 
  },
  welcomeText: { 
    fontSize: 38, 
    fontWeight: '700', 
    color: colors.text, 
    marginBottom: 8, 
    textAlign: 'center', 
  },
  subtitle: { 
    fontSize: 15, 
    color: colors.dim, 
    marginBottom: 35, 
  },
  startButton: {
    width: 180, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: colors.cyan,
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3,
  },
  startText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.card, 
  },
});

export default WelcomeScreen;
