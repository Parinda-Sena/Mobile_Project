import React, { useState } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,StatusBar,Platform,} from 'react-native';
import AppetizerScreen from './Screens/Menu/AppetizerScreen';
import colors from './styles/colors';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');

  if (screen === 'welcome') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg}/>
        <WelcomeScreen onStart={() => setScreen('main')} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg}/>
      <View style={styles.content}>{activeTab === 'home' && (
      <HomeScreen onCategoryPress={(category) => { setScreen(category); }}/>)}
        {activeTab === 'favorite' && (<FavoriteScreen /> )}
        {activeTab === 'cart' && (<CartScreen /> )}
        {screen === 'appetizer' && (<AppetizerScreen />)}
        {screen === 'mainCourse' && (<MainCourseScreen />)}
        {screen === 'dessert' && (<DessertScreen />  )}
        {screen === 'drink' && (<DrinkScreen />)}
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={() => {
            setActiveTab('home'); setScreen('main'); }} >
          <Text style={[styles.navIcon,activeTab === 'home' &&styles.activeNavIcon,]}>⌂</Text>
          <Text style={[styles.navText, activeTab === 'home' &&styles.activeNavText,]}>หน้าหลัก</Text></TouchableOpacity>        
          <TouchableOpacity style={styles.navItem} onPress={() => { setActiveTab('favorite'); setScreen('main');}}> 
          <Text style={[styles.navIcon,activeTab === 'favorite' && styles.activeNavIcon,]}> ♡</Text>
          <Text style={[ styles.navText,activeTab === 'favorite' &&styles.activeNavText,]} >Favorite</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {setActiveTab('cart');
            setScreen('main'); }}>
          <Text style={[styles.navIcon,activeTab === 'cart' && styles.activeNavIcon,]}> 🛒</Text>
          <Text style={[styles.navText,activeTab === 'cart' && styles.activeNavText,]}>ตะกร้า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: colors.bg,paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 44,},
  content: {flex: 1,},
  bottomNavigation: {height: 75,backgroundColor: colors.card,borderTopWidth: 1,borderTopColor: colors.border,
  flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center',},
  navItem: {flex: 1,alignItems: 'center',justifyContent: 'center',},
  navIcon: {fontSize: 23,color: colors.dim,marginBottom: 3,},
  activeNavIcon: {color: colors.cyan,},
  navText: {fontSize: 12,color: colors.dim,},
  activeNavText: {color: colors.cyan,fontWeight: '700',},
});