import { FontAwesome5 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useAuthStore } from '~/store/auth';

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log('Logging out...');
      await logout();
      console.log('Logout completed, routing to login');
      router.replace('/login');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <View className="w-full flex-1 bg-white">
      <View className="mt-2 flex w-full flex-row items-center justify-start">
        <TouchableOpacity className="px-4 py-4" onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="my-6 font-worksans text-2xl font-bold uppercase text-black">
          Account Manager
        </Text>
      </View>
      <ScrollView>
        <View className="flex flex-col items-start justify-start gap-y-6 bg-stone-100 px-4 py-8">
          <TouchableOpacity
            onPress={() => router.push('/account/details')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <FontAwesome name="user-o" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">Your Details</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to check your account details.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/discount')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <MaterialIcons name="discount" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">Discounts</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to check your discount details.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/order')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <FontAwesome5 name="box" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">Orders</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to check your order details.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/rma')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <Fontisto name="arrow-swap" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">RMA</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to return or repair an order.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/approvals')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <AntDesign name="checkcircleo" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">Approvals</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to approve your back-office and technicians.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/learn')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <AntDesign name="book" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">E-Learning</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to enroll and access a course.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/wishlist')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <AntDesign name="hearto" size={20} color="gray" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-gray-200">Wishlists</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to check all wishlisted products.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <Feather name="user-x" size={24} color="darkred" />
              <View className="flex flex-col">
                <Text className="font-worksans text-xl text-red-700">Delete Account</Text>
                <Text className="font-worksans text-xs text-stone-500">
                  Tap to delete your account.
                </Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={24} color="darkred" />
          </TouchableOpacity>

          <View className="mt-2 flex h-[1px] w-full items-center justify-center bg-gray-300" />

          <TouchableOpacity
            onPress={handleLogout}
            disabled={loading}
            className="mt-2 flex w-full flex-row items-center justify-center rounded-lg border bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              {loading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text className="text-xl font-extrabold uppercase text-stone-200">Logout</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// TODO: Delete account

export default AccountSettings;
