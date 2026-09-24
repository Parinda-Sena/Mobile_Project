import { Platform, StatusBar } from 'react-native';

export const colors = {
  bg: '#FBF9F5',        // Cream Off-White
  card: '#FFFFFF',      // Pure White 
  border: '#E6DFD5',    // Soft Beige 
  text: '#3D3731',      // Dark Taupe 
  dim: '#8C827A',       // Muted Earth Gray
  cyan: '#A0826C',      // Warm Terracotta Clay  
  green: '#8A9A86',     // Sage Green  
  red: '#c26042',       // Muted Red Clay  
};

export const topInset = Platform.select({
  ios: 56,
  android: (StatusBar.currentHeight ?? 24) + 12, 
  default: 24,
});