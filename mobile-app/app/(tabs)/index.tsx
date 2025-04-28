import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import Categories from '~/components/Categories';
import DiscountAd from '~/components/DiscountAd';
import Header from '~/components/Header';
import HomeCarousel from '~/components/HomeCarousel';
import NewProducts from '~/components/NewProducts';
import Powered from '~/components/Powered';
import TrendingProducts from '~/components/TrendingProducts';
import { useAuthStore } from '~/store/auth';

export default function Home() {
  const { loadToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await loadToken(); // Ensure token is loaded first
      const { token } = useAuthStore.getState(); // Get token after loading

      if (!token) {
        router.replace('/login');
      } else {
        setLoading(false); // Stop loading only if authenticated
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <HomeCarousel />
        <Categories />
        <TrendingProducts />
        <NewProducts />
        <DiscountAd />
        <Powered />
      </ScrollView>
    </View>
  );
}
