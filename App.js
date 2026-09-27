import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. นำเข้าหน้าจอต่างๆ ของฝั่งลูกค้าและหลังบ้าน
import WelcomeScreen from './src/screens/customer/WelcomeScreen'; 
import LoginScreen from './src/screens/kitchen/LoginScreen';          
import KitchenHomeScreen from './src/screens/kitchen/KitchenHomeScreen'; 
import HomeScreen from './src/screens/customer/HomeScreen';          

// นำเข้าหน้าจอหลังบ้านเพิ่ม (เช็ค path ให้ตรงกับที่เก็บไฟล์จริงของคุณนะครับ)
import OrderListScreen from './src/screens/kitchen/OrderListScreen'; // 
import StatusScreen from './src/screens/kitchen/StatusScreen';       // 
import SalesSummaryScreen from './src/screens/kitchen/SalesSummaryScreen'; // 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* หน้าแรก / หน้าต้อนรับ */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        
        {/* หน้าล็อกอินพนักงาน */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* หน้าหลักหลังบ้าน (ครัว) */}
        <Stack.Screen name="KitchenHome" component={KitchenHomeScreen} />
        
        {/* 2. ลงทะเบียนชื่อหน้า (Route Name) ให้ตรงกับที่เรียกใช้ในปุ่ม */}
        <Stack.Screen name="OrderList" component={OrderListScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="SalesSummary" component={SalesSummaryScreen} />
        
        {/* หน้าหลักฝั่งลูกค้า */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}