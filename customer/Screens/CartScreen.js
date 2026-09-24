import React from 'react';
import {View,Text,StyleSheet,} from 'react-native';
import colors from '../styles/colors';

function CartScreen() {

  return (
    <View style={styles.container}><Text style={styles.icon}>🛒</Text>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.text}>Your Menu list Show here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 30,},
  icon: {fontSize: 55,marginBottom: 15,},
  title: {fontSize: 22,fontWeight: '700',color: colors.text,marginBottom: 8,},
  text: {fontSize: 14,color: colors.dim,textAlign: 'center',},
});

export default CartScreen;