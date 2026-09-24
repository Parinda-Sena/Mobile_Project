import { useState } from 'react';
import { Alert, Button, Text, View, ActivityIndicator, StatusBar } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import Field from '../components/Field';
import { appStyles } from '../styles/appStyles';
import { loginUser } from '../../../database/db';

const LoginScreen = ({ onLoginSuccess }) => {
  const db = useSQLiteContext();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    if (!form.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await loginUser(db, form.username.trim(), form.password);

      if (user) {
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(user);
        }
      } else {
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={appStyles.center}>
      <StatusBar barStyle="dark-content" />
      <Text style={appStyles.title}>เข้าสู่ระบบ</Text>
      <Field
        label="ชื่อผู้ใช้"
        placeholder="กรอกชื่อผู้ใช้"
        autoCapitalize="none"
        value={form.username}
        onChangeText={(v) => setField('username', v)}
        error={errors.username}
      />
      <Field
        label="รหัสผ่าน"
        placeholder="กรอกรหัสผ่าน"
        secureTextEntry
        autoCapitalize="none"
        value={form.password}
        onChangeText={(v) => setField('password', v)}
        error={errors.password}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="เข้าสู่ระบบ" onPress={handleLogin} />
      )}
    </View>
  );
};

export default LoginScreen;