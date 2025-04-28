import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { dealerProfile } from '~/api/authServices';
import { fetchAllDiscounts } from '~/api/discountService';
import { useAuthStore } from '~/store/auth';

type DiscountType = {
  coupon_code: string;
  expiry_date: string;
  percentage: number;
  amount: number;
  isActive: boolean;
  dealer_id: string;
  product_id: string;
  dealer: {
    business_name: string;
  };
  Product: {
    product_title: string;
  };
};

const Discount = () => {
  const [data, setData] = useState<DiscountType[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuthStore.getState();

  const router = useRouter();

  if (!token) {
    throw new Error('No token found, please log in again.');
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await dealerProfile(token);
        setUserData(user.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!userData?.dealer_id) return;

    const getAllDiscounts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllDiscounts(userData.dealer_id);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching discounts:', err);
      } finally {
        setLoading(false);
      }
    };

    getAllDiscounts();
  }, [userData]);

  return (
    <View className="flex-1 bg-white">
      <View className="mt-2 flex w-full flex-row items-center justify-start bg-white">
        <TouchableOpacity className="px-4 py-4" onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="my-6 font-worksans text-2xl font-bold uppercase text-black">
          Discounts
        </Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView>
          <View className="flex min-h-screen w-full flex-col items-center justify-start gap-y-8 bg-stone-100 p-4">
            {/* If no discounts */}
            {data.length === 0 ? (
              <View className="flex min-h-screen w-full flex-col items-center justify-center">
                <Text className="text-center font-worksans text-gray-500">Oops!</Text>
                <Text className="text-center font-worksans text-gray-500">
                  No discounts assigned to you yet.
                </Text>
              </View>
            ) : (
              data.map((discount, idx: number) => (
                <View
                  key={idx}
                  className="flex w-full flex-col items-start justify-start gap-y-4 rounded-2xl border border-black/20 bg-black p-4">
                  <Text className="mb-4 font-worksans text-2xl font-extrabold uppercase text-orange-500">
                    Coupon: {discount.coupon_code}
                  </Text>
                  <Text className="font-worksans uppercase text-white">
                    Expires at - {discount.expiry_date.split('T')[0]}
                  </Text>
                  {discount.percentage ? (
                    <Text className="font-worksans uppercase text-white">
                      Percentage - {discount.percentage} %
                    </Text>
                  ) : (
                    <View />
                  )}
                  {discount.amount ? (
                    <Text className="font-worksans uppercase text-white">
                      Amount - {discount.amount}
                    </Text>
                  ) : (
                    <View className="hidden" />
                  )}
                  <Text className="font-worksans uppercase text-white">
                    Business - {discount.dealer.business_name}
                  </Text>
                  <Text className="font-worksans uppercase text-white">
                    Product - {discount.Product.product_title}
                  </Text>

                  <View className="flex w-full flex-row items-center justify-between">
                    {discount.isActive ? (
                      <Text className="mt-4 rounded-full bg-green-200 px-4 py-1 font-worksans text-green-800">
                        Active
                      </Text>
                    ) : (
                      <Text className="mt-4 rounded-full bg-red-200 px-4 py-1 font-worksans text-red-800">
                        Inactive
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/products/[product_id]',
                          params: { product_id: discount.product_id },
                        })
                      }
                      className="mt-4 rounded-full bg-white px-4 py-1">
                      <Text className="font-worksans text-black">View Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Discount;
