// components/AutoManualCarousel.tsx
import { useRef, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/marquee/router.jpg'),
  require('../assets/marquee/switches.jpg'),
  require('../assets/marquee/router2.png'),
];

const AUTO_SCROLL_INTERVAL = 3000;

export default function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentIndex]);

  const startAutoScroll = () => {
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View className="w-full bg-white">
      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <Image source={item} resizeMode="contain" className="h-60 rounded-xl" style={{ width }} />
        )}
      />

      {/* Dots BELOW the carousel */}
      <View className="mt-2 flex-row justify-center gap-x-2 space-x-2">
        {images.map((_, index) => (
          <View
            key={index}
            className={
              currentIndex === index
                ? 'h-2 w-8 rounded-full bg-black'
                : 'h-2 w-2 rounded-full bg-black/20'
            }
          />
        ))}
      </View>
    </View>
  );
}
