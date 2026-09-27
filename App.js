import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';

// นำเข้า Database config และฟังก์ชัน init
import { DATABASE_NAME, initDatabase } from './src/database/db'; 

// นำเข้าหน้าจอต่างๆ ของฝั่งลูกค้าและหลังบ้าน
import WelcomeScreen from './src/screens/customer/WelcomeScreen'; 
import LoginScreen from './src/screens/kitchen/LoginScreen';          
import KitchenHomeScreen from './src/screens/kitchen/KitchenHomeScreen'; 
import HomeScreen from './src/screens/customer/HomeScreen';    
import ReceiptScreen from './src/screens/customer/ReceiptScreen';   
import TableScreen from './src/screens/customer/TableScreen';   

// นำเข้าหน้าจอหลังบ้านเพิ่ม
import OrderListScreen from './src/screens/kitchen/OrderListScreen'; 
import StatusScreen from './src/screens/kitchen/StatusScreen';       
import SalesSummaryScreen from './src/screens/kitchen/SalesSummaryScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          {/* หน้าแรก / หน้าต้อนรับ */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          
          {/* หน้าล็อกอินพนักงาน */}
          <Stack.Screen name="Login" component={LoginScreen} />
          
          {/* หน้าหลักหลังบ้าน (ครัว) */}
          <Stack.Screen name="KitchenHome" component={KitchenHomeScreen} />
          
          {/* หน้าจอจัดการหลังบ้าน */}
          <Stack.Screen name="OrderList" component={OrderListScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="SalesSummary" component={SalesSummaryScreen} />
          
          {/* หน้าหลักฝั่งลูกค้า */}
          <Stack.Screen name="Table" component={TableScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Receipt" component={ReceiptScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
