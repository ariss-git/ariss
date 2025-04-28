import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { Button, ButtonText } from './ui/button';

import { getAllProducts } from '~/api/productServices';

type Product = {
  product_id: string;
  product_title: string;
  product_price: number;
  product_label: string;
  product_keywords: string[];
  product_image: string[];
};

const NewProducts = () => {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const newProducts = data.filter((product) => product.product_label === `New`).slice(0, 4);

  const router = useRouter();

  return (
    <View className="mt-16 flex w-full flex-col items-center justify-center gap-y-4 bg-white p-4">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="font-worksans text-2xl font-bold uppercase tracking-tight text-black">
          New Products
        </Text>
        <Text
          onPress={() => router.push('/products')}
          className="font-worksans text-base font-bold uppercase tracking-tight text-black/60">
          View All
        </Text>
      </View>

      {/* 2-column grid layout */}
      <View style={styles.gridContainer}>
        {newProducts.map((prod, idx) => (
          <View key={idx} style={styles.productCard}>
            {/* Set fixed size for the image */}
            <Image
              source={{ uri: prod.product_image[0] }}
              style={styles.productImage}
              resizeMode="contain"
            />
            {/* Align text to start */}
            <Text style={styles.productTitle}>{prod.product_title}</Text>
            <Text style={styles.productPrice}>₹ {prod.product_price}</Text>
            {/* <Text style={styles.productKeywords}>
              {prod.product_keywords[0]} {prod.product_keywords[1]}
            </Text> */}
            <Button
              variant="solid"
              className="mt-2 flex w-full flex-row items-center justify-center gap-x-3 bg-stone-800"
              onPress={() =>
                router.push({
                  pathname: '/products/[product_id]',
                  params: { product_id: prod.product_id },
                })
              }>
              <ButtonText className="font-worksans text-stone-200">View</ButtonText>
              <AntDesign name="eyeo" size={18} color="lightgray" />
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  productCard: {
    width: '48%', // Ensures 2 columns
    marginBottom: 16,
    padding: 10,
    alignItems: 'flex-start',
    backgroundColor: 'white', // important for shadow to look nice
    borderRadius: 12, // rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  productImage: {
    width: '100%',
    height: 150, // Fixed height for all images
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
    fontFamily: 'WorkSans',
    marginBlock: 2,
  },
  productPrice: {
    fontSize: 14,
    marginTop: 4,
    color: 'gray',
    fontFamily: 'WorkSans',
  },
  productKeywords: {
    fontSize: 14,
    marginTop: 4,
    color: 'gray',
    fontFamily: 'WorkSans',
  },
});

export default NewProducts;
