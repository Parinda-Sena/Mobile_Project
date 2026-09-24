import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,} from 'react-native';
import colors from '../styles/colors';
function MainCourseScreen() {
  const menuItems = [
    {id: 1,name: 'Ommlette on Rice',price: 40,icon: '🍳',},
    {id: 2,name: 'Tom Yum Goong',price: 150,icon: '🍲',},
    {id: 3,name: 'American Fried Rice',price: 70,icon: '🍛',},
    {id: 4,name: 'Pork Steak',price: 69,icon: '🥩', },
    {id: 5,name: 'Beef Steak',price: 89,icon: '🥩',},
    {id: 6,name: 'Spaghetti with Spicy Seafood',price: 79,icon: '🍝',},
    {id: 7,name: 'Spaghetti Carbonara',price: 79,icon: '🍝',},
    {id: 8,name: 'Stir-Fried Basil with Minced Pork on Rice',price: 50,icon: '🍛',},
    {id: 9,name: 'Pork Fried Rice',price: 50,icon: '🍚',},
    {id: 10,name: 'Deep-Fried Seabass with Fish Sauce',price: 180,icon: '🐟',},
];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Main Course </Text>
        <Text style={styles.subtitle}>อาหารจานหลัก</Text>
      </View>
      <ScrollView contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => ( <TouchableOpacity key={item.id}
          style={styles.menuCard} activeOpacity={0.8}>
            <View style={styles.imageBox}><Text style={styles.icon}>{item.icon}
              </Text>
            </View>
            <View style={styles.info}><Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.price}>{item.price} ฿</Text>
            </View>

            <View style={styles.addButton}> <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({ 
  container: {flex: 1,backgroundColor: colors.bg,},
  header: {paddingHorizontal: 24,paddingTop: 10,paddingBottom: 15,},
  title: {fontSize: 27,fontWeight: '700',color: colors.text,},
  subtitle: {fontSize: 14,color: colors.dim, marginTop: 4,},
  menuContainer: { paddingHorizontal: 24,paddingBottom: 30, gap: 12,},
  menuCard: {minHeight: 90,backgroundColor: colors.card,borderWidth: 1,
  borderColor: colors.border,borderRadius: 18,padding: 12,
  flexDirection: 'row',alignItems: 'center',},
  imageBox: {width: 68,height: 68,borderRadius: 15,backgroundColor: '#F3EEE7',
  justifyContent: 'center', alignItems: 'center',},
  icon: {fontSize: 34,},
  info: {flex: 1,marginLeft: 15,},
  menuName: {fontSize: 16,fontWeight: '700',color: colors.text,marginBottom: 6,},
  price: {fontSize: 15,fontWeight: '600',color: colors.cyan,},
  addButton: {width: 38,height: 38,borderRadius: 19,backgroundColor: colors.cyan,
  justifyContent: 'center',alignItems: 'center',},
  addText: {color: colors.card,fontSize: 25,fontWeight: '500',lineHeight: 27,},
});
export default MainCourseScreen;