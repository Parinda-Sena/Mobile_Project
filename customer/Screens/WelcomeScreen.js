import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import colors from '../styles/colors';

function WelcomeScreen({ onStart }) {
  const handleStaffLogin = () => {Alert.alert('Staff Login','หน้าสำหรับพนักงานเข้าสู่ระบบ');};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.staffButton} onPress={handleStaffLogin} activeOpacity={0.8}>
        <Text style={styles.staffIcon}> ☰ </Text>
      </TouchableOpacity>
      <View style={styles.centerContent}><Text style={styles.welcomeText}>Welcome to meow restaurant</Text>
        <Text style={styles.subtitle}>Click to start</Text>

        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8} >
          <Text style={styles.startText}> Start </Text> </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,},
  staffButton: {position: 'absolute',top: 16,right: 24,width: 48,height: 48,borderRadius: 24,
    backgroundColor: colors.card,borderWidth: 1,borderColor: colors.border,justifyContent: 'center',
    alignItems: 'center',zIndex: 10,},
  staffIcon: {fontSize: 20,color: colors.cyan,},
  centerContent: {flex: 1,justifyContent: 'center',alignItems: 'center',paddingHorizntal: 30,},
  welcomeText: {fontSize: 42,fontWeight: '700',color: colors.text,marginBottom: 8,textAlign: 'center',},
  subtitle: {fontSize: 15,color: colors.dim,marginBottom: 35,},
  startButton: {width: 180,height: 52,borderRadius: 26,backgroundColor: colors.cyan,
    justifyContent: 'center',alignItems: 'center',},
  startText: {fontSize: 18,fontWeight: '700',color: colors.card,},
});

export default WelcomeScreen;