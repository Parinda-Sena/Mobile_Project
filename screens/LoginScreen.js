import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Button,
    Text,
    View,
} from 'react-native';

import Field from '../components/Field';
import { loginUser } from '../db/database';
import { appStyles } from '../styles/appStyles';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    }

    if (!form.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      const user = await loginUser(
        form.username.trim(),
        form.password
      );

      if (!user) {
        Alert.alert(
          'เข้าสู่ระบบไม่สำเร็จ',
          'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        );
        return;
      }

      navigation.replace('Home');

    } catch (error) {
      console.error('Login error:', error);

      Alert.alert(
        'เกิดข้อผิดพลาด',
        'ไม่สามารถเข้าสู่ระบบได้'
      );
    }
  };

  return (
    <View style={appStyles.center}>

      <Text style={appStyles.title}>
        เข้าสู่ระบบ
      </Text>

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

      <Button
        title="เข้าสู่ระบบ"
        onPress={handleLogin}
      />

      <StatusBar style="auto" />

    </View>
  );
};

export default LoginScreen;