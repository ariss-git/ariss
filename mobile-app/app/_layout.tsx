import '../global.css';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

SplashScreen.preventAutoHideAsync(); // prevent splash screen from hiding too early

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Posterama: require('../assets/fonts/Posterama.ttf'),
    WorkSans: require('../assets/fonts/WorkSans.ttf'),
    // Add more styles if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hide splash once fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Optional: Show a loader here
  }

  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </GluestackUIProvider>
  );
}
