import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';

import { initDatabase } from './src/database/db';

import WelcomeScreen from './src/screens/customer/WelcomeScreen';
import LoginScreen from './src/screens/kitchen/LoginScreen';
import KitchenHomeScreen from './src/screens/kitchen/KitchenHomeScreen';
import HomeScreen from './src/screens/customer/HomeScreen';
import ReceiptScreen from './src/screens/customer/ReceiptScreen';
import TableScreen from './src/screens/customer/TableScreen';

import OrderListScreen from './src/screens/kitchen/OrderListScreen';
import StatusScreen from './src/screens/kitchen/StatusScreen';
import SalesSummaryScreen from './src/screens/kitchen/SalesSummaryScreen';
import BillDetailScreen from './src/screens/kitchen/BillDetailScreen';
import TopMenuScreen from './src/screens/kitchen/TopMenuScreen';
import MenuManagementScreen from './src/screens/kitchen/MenuManagementScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName="restaurant.db" onInit={initDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="KitchenHome" component={KitchenHomeScreen} />
          <Stack.Screen name="OrderList" component={OrderListScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="SalesSummary" component={SalesSummaryScreen} />
          <Stack.Screen name="TopMenu" component={TopMenuScreen} />
          <Stack.Screen name="MenuManagement" component={MenuManagementScreen} />
          <Stack.Screen name="BillDetail" component={BillDetailScreen} />
          <Stack.Screen name="Table" component={TableScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Receipt" component={ReceiptScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}