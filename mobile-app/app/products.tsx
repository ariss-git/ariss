import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { getAllProducts } from '~/api/productServices';
import Header from '~/components/Header';

interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_label: string;
  product_keywords: string[];
  product_image: string[];
}

const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getAllProducts();
        setData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = data.filter((item) => item.product_title.toLowerCase().includes(keyword));
    setFilteredData(filtered);
  }, [search]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="w-full flex-1 bg-white">
      <Header />

      <ScrollView>
        <View className="w-full px-6">
          <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4">
            <View className="mr-2 w-[30px]">
              <EvilIcons name="search" size={24} color="black" />
            </View>
            <TextInput
              className="flex-1 font-worksans text-black"
              placeholder="Search Product Name"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              keyboardType="default"
              maxLength={10}
            />
          </View>
        </View>
        <View className="flex flex-row flex-wrap justify-between gap-y-6 px-4 py-6">
          {filteredData.map((product) => (
            <View key={product.product_id} className="w-[48%] rounded-lg bg-white p-3">
              <Image
                source={{ uri: product.product_image[0] }}
                resizeMode="contain"
                className="mb-2 h-36 w-full rounded-lg"
              />
              <Text className="font-worksans text-sm text-gray-500">{product.product_label}</Text>
              <Text className="mt-1 font-worksans text-[15px] font-medium uppercase">
                {product.product_title}
              </Text>
              <Text className="mt-2 font-worksans text-[15px] font-semibold">
                ₹ {product.product_price}
              </Text>

              {/* <View className="mb-2 mt-2">
                <Text className="font-worksans text-[12px] text-gray-500">
                  {product.product_keywords[0]}
                  {product.product_keywords[1]}
                </Text>
              </View> */}

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/products/[product_id]',
                    params: { product_id: product.product_id },
                  })
                }
                className="mt-4 flex flex-row items-center justify-center gap-x-4 rounded-md bg-black py-2">
                <Text className="text-center font-worksans text-lg font-semibold text-white">
                  View
                </Text>
                <AntDesign name="eyeo" size={18} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Products;
