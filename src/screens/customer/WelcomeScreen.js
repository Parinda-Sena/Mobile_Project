import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { colors, topInset } from '../../styles/Theme';
export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} translucent />
      <TouchableOpacity style={styles.staffButton} onPress={() => navigation.navigate('Login', { from: 'Welcome' })} activeOpacity={0.7}>
        <Text style={styles.staffIcon}>☰</Text>
      </TouchableOpacity>
      <View style={styles.centerContent}>
        <View style={styles.logoBadge}><Text style={styles.logoEmoji}> 😸</Text></View>
        <Text style={styles.welcomeText}>Welcome to{"\n"}meow restaurant</Text>
        <Text style={styles.subtitle}>Tap start to explore our menu</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Table')} activeOpacity={0.85} >
          <Text style={styles.startText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  staffButton: {position: 'absolute', top: topInset, right: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center', zIndex: 999, elevation: 3,},
  staffIcon: { fontSize: 18, color: colors.cyan, fontWeight: '600' },
  logoBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.card,
  borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 24,},
  logoEmoji: { fontSize: 36 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 10, textAlign: 'center', lineHeight: 40 },
  subtitle: { fontSize: 15, color: colors.dim, marginBottom: 40, textAlign: 'center' },
  startButton: { width: '100%', maxWidth: 240, height: 54, borderRadius: 27,backgroundColor: colors.cyan, justifyContent: 'center', alignItems: 'center', elevation: 4,},
  startText: { fontSize: 18, fontWeight: '700', color: colors.card },
});
