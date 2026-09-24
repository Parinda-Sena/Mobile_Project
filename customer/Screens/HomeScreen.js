import React from 'react';
import {View,Text,TouchableOpacity,ScrollView,StyleSheet,} from 'react-native';
import colors from '../styles/colors';
function HomeScreen({ onCategoryPress }) {
  const categories = [
    {id: 'C004',title: 'อาหารเรียกน้ำย่อย',subtitle: 'Appetizers',icon: '🥗',screen: 'appetizer',},
    {id: 'C003',title: 'อาหารจานหลัก',subtitle: 'Main Course',icon: '🍛',screen: 'mainCourse',},
    {id: 'C001',title: 'ของหวาน',subtitle: 'Desserts',icon: '🍰',screen: 'dessert',},
    {id: 'C002',title: 'น้ำดื่ม',subtitle: 'Beverages',icon: '🥤',screen: 'drink',},
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Welcome</Text>
          <Text style={styles.title}>What would you like?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}> Menu Categories </Text>
        <View style={styles.categoryContainer}>
          {categories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.categoryCard} activeOpacity={0.8}
              onPress={() => onCategoryPress(item.screen) } >
              <View style={styles.iconBox}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{item.title} </Text>
                <Text style={styles.categorySubtitle}> {item.subtitle} </Text>
               </View>
              <Text style={styles.arrow}> › </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,},
  header: {paddingHorizontal: 24,paddingBottom: 20,flexDirection: 'row',
  justifyContent: 'space-between',alignItems: 'center',},
  smallTitle: {fontSize: 14,color: colors.dim,marginBottom: 4,},
  title: {fontSize: 25,fontWeight: '700',color: colors.text,},
  profileButton: {width: 45,height: 45,borderRadius: 23,backgroundColor: colors.card,borderWidth: 1,
  borderColor: colors.border,justifyContent: 'center',alignItems: 'center',},
  profileIcon: {fontSize: 20,},
  scrollView: {flex: 1,},
  content: {paddingHorizontal: 24,paddingBottom: 30,},
  sectionTitle: {fontSize: 19,fontWeight: '700',color: colors.text,marginBottom: 16,},
  categoryContainer: {gap: 14,},
  categoryCard: {minHeight: 100,backgroundColor: colors.card,borderRadius: 18,
  borderWidth: 1,borderColor: colors.border,padding: 16,flexDirection: 'row',alignItems: 'center',},
  iconBox: {width: 62,height: 62,borderRadius: 16,backgroundColor: '#F3EEE7',justifyContent: 'center',
  alignItems: 'center',marginRight: 15,},
  categoryIcon: {fontSize: 31,},
  categoryText: {flex: 1,},
  categoryTitle: {fontSize: 17,fontWeight: '700',color: colors.text,marginBottom: 4,},
  categorySubtitle: {fontSize: 13,color: colors.dim,},
  arrow: {fontSize: 30,color: colors.dim,fontWeight: '300',},
});

export default HomeScreen;