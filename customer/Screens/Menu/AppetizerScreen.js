import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,} from 'react-native';
import { colors } from '../../components/theme';

function AppetizerScreen() {
  const menuItems = [
    {id: 1,name: 'Shrimp Donut',price: 49,icon: '🍩', },
    {id: 2,name: 'French Fries', price: 49,icon: '🍟',},
    {id: 3,name: 'Chicken Nugget',price: 49,icon: '🍗',},
    {id: 4,name: 'Chicken Pop',price: 49,icon: '🍗',},
    {id: 5,name: 'Egg Tar',price: 35,icon: '🥧',},
    {id: 6,name: 'Wingz Zabb',price: 49,icon: '🍗',},
    {id: 7,name: 'Cream of Truffle Mushroom Soup',price: 79,icon: '🍲',},
    {id: 8,name: 'Toast',price: 35,icon: '🍞',},
    {id: 9,name: 'Spinach with Cheese',price: 69,icon: '🥬',},
    {id: 10,name: 'Lasagna',price: 79,icon: '🍝',},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appetizers</Text>
        <Text style={styles.subtitle}>อาหารเรียกน้ำย่อย</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (<TouchableOpacity key={item.id}
        style={styles.menuCard} activeOpacity={0.8} >
        <View style={styles.imageBox}><Text style={styles.icon}>{item.icon}
            </Text>
             </View>
            <View style={styles.info}><Text style={styles.menuName}>{item.name}
              </Text>
              <Text style={styles.price}>{item.price} ฿ </Text>
            </View>
            <View style={styles.addButton}>
              <Text style={styles.addText}> +</Text>
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
  subtitle: {fontSize: 14,color: colors.dim,marginTop: 4,},
  menuContainer: {paddingHorizontal: 24,paddingBottom: 30,gap: 12,},
  menuCard: {minHeight: 90,backgroundColor: colors.card,borderWidth: 1,
    borderColor: colors.border,borderRadius: 18,padding: 12,flexDirection: 'row',
    alignItems: 'center',},
  imageBox: {width: 68,height: 68,borderRadius: 15,backgroundColor: '#F3EEE7',
    justifyContent: 'center',alignItems: 'center',},
  icon: {fontSize: 34,},
  info: {flex: 1,marginLeft: 15,},
  menuName: {fontSize: 16,fontWeight: '700',color: colors.text, marginBottom: 6,
  },
  price: {fontSize: 15,fontWeight: '600',color: colors.cyan,},
  addButton: {width: 38,height: 38,borderRadius: 19,backgroundColor: colors.cyan,
    justifyContent: 'center',alignItems: 'center',},
  addText: {color: colors.card, fontSize: 25,fontWeight: '500',lineHeight: 27,
  },
});

export default AppetizerScreen;