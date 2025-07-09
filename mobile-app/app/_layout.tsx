import '../global.css';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; // Import these

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Posterama: require('../assets/fonts/Posterama.ttf'),
    WorkSans: require('../assets/fonts/HankenGrotesk.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider> 
      <GluestackUIProvider mode="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <StatusBar hidden />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}