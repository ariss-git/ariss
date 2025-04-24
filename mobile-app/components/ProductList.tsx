import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

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
            onPress={() =>
              router.push({
                pathname: '/products/[product_id]',
                params: { product_id: item.product_id },
              })
            }>
            <View className="mb-6 rounded-lg bg-gray-200 p-4">
              <Image
                source={{ uri: item.product_image[0] }}
                className="rounded-t-lg"
                resizeMode="contain"
                style={{ width: '100%', height: 300 }}
              />
              <Text className="mt-2 text-start font-worksans text-xl font-semibold">
                {item.product_title}
              </Text>
              <Text className="mt-1 text-start font-worksans text-lg font-medium">
                ₹ {item.product_price}
              </Text>

              {/* Keywords Section */}
              <View className="mt-2 flex-row flex-wrap gap-2">
                {item.product_keywords.map((keyword, index) => (
                  <View key={index} className="rounded-md bg-orange-500 px-3 py-1 shadow-sm">
                    <Text className="text-sm text-black">{keyword}</Text>
                  </View>
                ))}
              </View>

              <Text className="mt-6 text-start text-sm text-gray-500">
                Min. Order Quantity: {item.product_quantity}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProductGrid;
