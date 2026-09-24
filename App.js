import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrderListScreen from './src/screens/OrderListScreen';
import StatusScreen from './src/screens/StatusScreen';
import SalesSummaryScreen from './src/screens/SalesSummaryScreen';

import {
  DATABASE_NAME,
  initDatabase,
} from './src/db/database';

const Stack = createNativeStackNavigator();

export default function App() {

  const [ready, setReady] = useState(false);

  useEffect(() => {

    const startApp = async () => {

      try {

        const db = SQLite.openDatabaseSync(DATABASE_NAME);

        await initDatabase(db);

        setReady(true);

      } catch (error) {

        console.error('Start app error:', error);

      }

    };

    startApp();

  }, []);

  if (!ready) {
    return null;
  }

  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'เข้าสู่ระบบ',
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'ระบบหลังร้าน',
          }}
        />

        <Stack.Screen
          name="OrderList"
          component={OrderListScreen}
          options={{
            title: 'รายการที่ต้องทำ',
          }}
        />

        <Stack.Screen
          name="Status"
          component={StatusScreen}
          options={{
            title: 'การเปลี่ยนสถานะ',
          }}
        />

        <Stack.Screen
          name="SalesSummary"
          component={SalesSummaryScreen}
          options={{
            title: 'สรุปยอดขาย',
          }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}