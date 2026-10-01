import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Field from '../../components/Field';
import { appStyles } from '../../styles/appStyles';

const ADMIN_PIN = 'admin123';

const LoginScreen = ({ navigation, route }) => {
  const fromScreen = route.params?.from || 'Table';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!pin.trim()) {
      return setError('Please enter your password');
    }
    if (pin === ADMIN_PIN) {
      navigation.replace('KitchenHome');
    } else {
      Alert.alert('Login Failed', 'Incorrect password. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.navigate(fromScreen === 'Welcome' ? 'Welcome' : 'Table');
  };

  return (
    <View style={appStyles.center}>
      <TouchableOpacity style={appStyles.backBtn} onPress={handleBack}>
        <Text style={appStyles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={appStyles.title}>Admin</Text>

      <Field
        label="Password"
        placeholder="Enter the password"
        secureTextEntry
        autoCapitalize="none"
        value={pin}
        onChangeText={(v) => {
          setPin(v);
          setError('');
        }}
        error={error}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  loginBtn: { backgroundColor: '#698269', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default LoginScreen;