import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { getProductBySubcategory } from '~/api/productServices';

// Define Product Interface
interface Product {
  product_id: string;
  product_title: string;
  product_image: string[];
  product_price: number;
  product_quantity: number;
  product_keywords: string[];
}

// Define Props for ProductGrid
interface ProductGridProps {
  subcategory_id: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ subcategory_id }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!subcategory_id) return;

    const fetchProducts = async () => {
      try {
        const response = await getProductBySubcategory(subcategory_id);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategory_id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <Text className="mt-10 text-center font-worksans text-gray-500">No products found.</Text>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center bg-white px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold text-black">Products</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/products/[product_id]',
                params: { product_id: item.product_id },
              })
            }>
            <View
              className="mb-6 rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
              style={styles.shadowContainer}>
              <View className="flex w-full flex-row items-center justify-start gap-x-4">
                <Image
                  source={{ uri: item.product_image[0] }}
                  resizeMode="contain"
                  style={{ width: 90, height: 90, borderRadius: 10 }}
                />
                <View className="flex w-full flex-col gap-y-0">
                  <Text className="text-start font-worksans text-xl font-semibold text-black">
                    {item.product_title}
                  </Text>
                  <Text className="text-start font-worksans text-lg font-medium text-gray-700">
                    ₹ {item.product_price}
                  </Text>
                  <Text className="text-start text-sm text-gray-500">
                    Min. Order Quantity: {item.product_quantity}
                  </Text>
                </View>
              </View>

              {/* Keywords Section */}
              <View className="mt-2 flex-row flex-wrap gap-2">
                {item.product_keywords.map((keyword, index) => (
                  <View
                    key={index}
                    className="rounded-md bg-orange-500 px-3 py-1"
                    style={styles.tagShadow}>
                    <Text className="text-sm text-black">{keyword}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  tagShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // slight shadow for tags
  },
});

export default ProductGrid;
