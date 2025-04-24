import { useEffect, useRef } from 'react';
import { View, Dimensions, Image, StyleSheet, Animated, FlatList } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  { id: '1', image: require('../assets/marquee/router2.png') },
  { id: '2', image: require('../assets/marquee/router.jpg') },
  { id: '3', image: require('../assets/marquee/switches.jpg') },
  { id: '4', image: require('../assets/marquee/cables.jpeg') },
];

// Configurations
const ITEM_WIDTH = screenWidth * 1; // 80% of screen
const ITEM_SPACING = (screenWidth - ITEM_WIDTH) / 2;
const AUTO_SCROLL_INTERVAL = 3000; // Auto-scroll every 3 seconds

const Carousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Image Carousel */}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 500);
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9], // Smooth scaling effect
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_WIDTH }}>
              <Animated.View style={[styles.itemContainer, { transform: [{ scale }] }]}>
                <Image source={item.image} style={styles.image} />
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        {data.map((_, index) => {
          const progress = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
            outputRange: [0.3, 1, 0.3], // Highlight active indicator
            extrapolate: 'clamp',
          });

          return <Animated.View key={index} style={[styles.progressBar, { opacity: progress }]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: ITEM_SPACING / 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 400,
    height: 300, // Fixed height for uniformity
    resizeMode: 'contain', // Ensures full image is visible without cutting
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  progressBar: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
});

export default Carousel;
