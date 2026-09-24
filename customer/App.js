import React, { useState } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Alert,StatusBar,} from 'react-native';
import HomeScreen from './Screens/HomeScreen';

const colors = {
  bg: '#FBF9F5',
  card: '#FFFFFF',
  border: '#E6DFD5',
  text: '#3D3731',
  dim: '#8C827A',
  cyan: '#A0826C',
};
export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  if (!isStarted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <TouchableOpacity style={styles.staffButton} activeOpacity={0.7} 
          onPress={() => { Alert.alert( 'Staff Login', 'หน้าสำหรับพนักงานเข้าสู่ระบบ' ); }} >
          <Text style={styles.staffIcon}>☰</Text>
        </TouchableOpacity>
         <View style={styles.centerContent}>
          <Text style={styles.welcomeText}> Welcome to meow restaurant </Text>
          <Text style={styles.subtitle}> Click to start </Text>
           <TouchableOpacity style={styles.startButton} activeOpacity={0.7} onPress={() => { setIsStarted(true); }} > 
            <Text style={styles.startText}> Start </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
   return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <HomeScreen onCategoryPress={(category) => { console.log('Selected category:', category); }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: colors.bg,},
  staffButton: {position: 'absolute', top: 16,right: 24,width: 48,height: 48,
    borderRadius: 24,backgroundColor: colors.card,borderWidth: 1,
    borderColor: colors.border,justifyContent: 'center',alignItems: 'center',
    zIndex: 100,elevation: 5,},
  staffIcon: {fontSize: 20,color: colors.cyan,},
  centerContent: {flex: 1,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 30,},
  welcomeText: {fontSize: 42,fontWeight: '700',color: colors.text,marginBottom: 8,textAlign: 'center',},
  subtitle: {fontSize: 15,color: colors.dim,marginBottom: 35,},
  startButton: {width: 180,height: 52,borderRadius: 26,backgroundColor: colors.cyan,
    justifyContent: 'center',alignItems: 'center',elevation: 3,},
  startText: {fontSize: 18,fontWeight: '700',color: colors.card,},

});
