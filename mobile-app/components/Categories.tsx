import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

import { fetchAllCategories } from '~/api/productServices';

interface Category {
  category_id: string;
  category_name: string;
  category_image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mt-12 flex items-start justify-start">
        <TouchableOpacity>
          <Text className="font-worksans text-2xl font-bold uppercase tracking-tight">
            Shop by Category
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-2 h-40">
        <FlatList
          data={categories}
          keyExtractor={(item) => item.category_id}
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mr-10"
              onPress={() =>
                router.push({
                  pathname: '/subcategory/[category_id]',
                  params: { category_id: item.category_id },
                })
              }>
              {/* Shadow Container */}
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 12, // same as inner View if you want
                  backgroundColor: 'white', // background needs to be white
                  marginBottom: 8,
                }}
                className="h-28 w-32 justify-center">
                {/* Image Container */}
                <View className="h-full w-full overflow-hidden rounded-lg border border-stone-300 bg-white p-1">
                  <Image
                    source={{ uri: item.category_image }}
                    resizeMode="contain"
                    className="h-full w-full"
                  />
                </View>
              </View>

              <Text className="mt-3 w-32 text-left font-worksans font-medium text-black/80">
                {item.category_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Categories;
