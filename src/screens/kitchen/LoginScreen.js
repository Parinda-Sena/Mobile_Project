import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {Alert,Text,TouchableOpacity,View,StyleSheet,} from 'react-native';
import Field from '../../components/Field';
import { appStyles } from '../../styles/appStyles';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const LoginScreen = ({ navigation, route }) => { 
  const fromScreen = route.params?.from || 'Table';
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value,}));
    setErrors((prev) => ({ ...prev, [key]: '', }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) {newErrors.username = 'กรุณากรอกชื่อผู้ใช้';}
    if (!form.password) {newErrors.password = 'กรุณากรอกรหัสผ่าน';}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = () => { 
    if (!validate()) {
      return;
    }
    const username = form.username.trim();
    const password = form.password;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      navigation.replace('KitchenHome');
    } else {
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ','ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleBack = () => {
    if (fromScreen === 'Welcome') {
      navigation.navigate('Welcome');
    } else {
      navigation.navigate('Table');
    }
  };

  return (
    <View style={appStyles.center}>
       <TouchableOpacity style={appStyles.backBtn} onPress={handleBack} >
      <Text style={appStyles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={appStyles.title}> เข้าสู่ระบบสำหรับพนักงาน </Text>
      <Field label="ชื่อผู้ใช้" placeholder="กรอกชื่อผู้ใช้" autoCapitalize="none" value={form.username} onChangeText={(v) => setField('username', v) }
        error={errors.username} />
      <Field label="รหัสผ่าน" placeholder="กรอกรหัสผ่าน" secureTextEntry autoCapitalize="none" value={form.password} onChangeText={(v) =>
          setField('password', v) }
        error={errors.password} />
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8} >
        <Text style={styles.loginBtnText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
    <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  loginBtn: {backgroundColor: '#698269',width: '100%',paddingVertical: 14,borderRadius: 12,alignItems: 'center',marginTop: 16,},
  loginBtnText: {color: '#FFFFFF',fontSize: 16,fontWeight: '700',},
  cancelBtnText: {color: '#FFFFFF',fontSize: 16,fontWeight: '700',},
});

export default LoginScreen;