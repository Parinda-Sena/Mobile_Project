import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import colors from '../components/theme';
 const FavoriteScreen = ({ favorites, onToggleFavorite, onAddToCart }) => {
  const favoriteMenus = favorites;
if (favoriteMenus.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>♡</Text>
        <Text style={styles.emptyText}>Dosen't have Favorite menu yet</Text>
        <Text style={styles.emptyHint}>Click ♡ to your Favorite menu</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite</Text>
        <Text style={styles.subtitle}>My Favorite Menu </Text>
      </View>

      <FlatList data={favoriteMenus} keyExtractor={(item) => item.menu_id.toString()}
        numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} renderItem={({ item }) => (
          <MenuItemCard menu={item} isFavorite={true} onToggleFavorite={() => onToggleFavorite(item)}
            onAddToCart={() => onAddToCart(item)} /> )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background,},
  header: {paddingHorizontal: 20,paddingTop: 20,paddingBottom: 10,},
  title: {fontSize: 28,fontWeight: 'bold',color: colors.text,},
  subtitle: {fontSize: 15,color: colors.muted,marginTop: 4,},
  list: {paddingHorizontal: 14,paddingBottom: 20,},
  row: {justifyContent: 'space-between',marginBottom: 14,},
  empty: {flex: 1,alignItems: 'center',justifyContent: 'center',padding: 30,
    backgroundColor: colors.background,},
  emptyIcon: {fontSize: 60,color: colors.primary,marginBottom: 10,},
  emptyText: {color: colors.text,fontSize: 20,fontWeight: '700',},
  emptyHint: {color: colors.muted,fontSize: 15,marginTop: 8,textAlign: 'center',lineHeight: 22,},
});

export default FavoriteScreen;