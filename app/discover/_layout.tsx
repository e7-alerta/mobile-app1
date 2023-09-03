import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {Slot, SplashScreen, Stack} from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return <Slot />;
}
