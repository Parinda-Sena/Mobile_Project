import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Field from '../../components/Field';
import { appStyles } from '../../styles/appStyles';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

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

  const handleLogin = () => {
    if (!validate()) {
      return;
    }

    const username = form.username.trim();
    const password = form.password;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // เปลี่ยนจาก 'Home' (ที่เป็นของลูกค้า) เป็น 'KitchenHome' (ของหลังบ้าน)
      navigation.replace('KitchenHome');
    } else {
      Alert.alert(
        'เข้าสู่ระบบไม่สำเร็จ',
        'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      );
    }
  };

  return (
    <View style={appStyles.center}>

      <TouchableOpacity
      style={appStyles.backBtn}
      onPress={() => navigation.navigate('Welcome')}
      >
      <Text style={appStyles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={appStyles.title}>
        เข้าสู่ระบบ
      </Text>

      <Field
        label="ชื่อผู้ใช้"
        placeholder="กรอกชื่อผู้ใช้"
        autoCapitalize="none"
        value={form.username}
        onChangeText={(v) =>
          setField('username', v)
        }
        error={errors.username}
      />

      <Field
        label="รหัสผ่าน"
        placeholder="กรอกรหัสผ่าน"
        secureTextEntry
        autoCapitalize="none"
        value={form.password}
        onChangeText={(v) =>
          setField('password', v)
        }
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
