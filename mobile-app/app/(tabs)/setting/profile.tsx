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

import Header from '~/components/Header';
import { ChevronDownIcon } from '~/components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '~/components/ui/select';
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
      <View className="w-full">
        <Header />
      </View>
      <ScrollView>
        <View className="flex flex-col items-start justify-start gap-y-6 bg-transparent px-4 py-8">
          <TouchableOpacity
            onPress={() => router.push('/account/details')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <FontAwesome name="user-o" size={24} color="lightgray" />
              <Text className="font-worksans text-2xl text-gray-200">Your Details</Text>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <View className="flex w-full flex-row items-center justify-center gap-x-4 px-2">
            <TouchableOpacity
              onPress={() => router.push('/discount')}
              className="flex w-[50%] flex-row items-center justify-center rounded-lg border bg-transparent px-4 py-2">
              <View className="flex flex-row items-center justify-center gap-x-2">
                <MaterialIcons name="discount" size={20} color="gray" />
                <Text className="font-worksans text-xl text-stone-800">Discounts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/rma')}
              className="flex w-[50%] flex-row items-center justify-center rounded-lg border bg-transparent px-4 py-2">
              <View className="flex flex-row items-center justify-center gap-x-2">
                <Fontisto name="arrow-swap" size={20} color="gray" />
                <Text className="font-worksans text-xl text-stone-800">RMA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex w-full flex-row items-center justify-center gap-x-4 px-2">
            <TouchableOpacity
              onPress={() => router.push('/wishlist')}
              className="flex w-[50%] flex-row items-center justify-center rounded-lg border bg-transparent px-4 py-2">
              <View className="flex flex-row items-center justify-center gap-x-2">
                <AntDesign name="hearto" size={20} color="gray" />
                <Text className="font-worksans text-xl text-stone-800">Wishlist</Text>
              </View>
            </TouchableOpacity>

            <Select>
              <SelectTrigger className="rounded-xl bg-transparent px-4 py-3">
                <SelectInput
                  placeholder="Approvals"
                  className="h-[100px] w-[160px] rounded-sm px-4 py-2 text-center text-xl placeholder:text-black"
                />
                {/* <TouchableOpacity className="flex w-[50%] flex-row items-center justify-center rounded-lg border bg-transparent px-4 py-2">
                  <View className="flex flex-row items-center justify-center gap-x-2">
                    <AntDesign name="checkcircleo" size={20} color="gray" />
                    <Text className="font-worksans text-xl text-stone-800">Approvals</Text>
                  </View>
                </TouchableOpacity> */}
                <SelectIcon className="absolute right-2 text-white" as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="z-50 border border-gray-600 bg-black">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem
                    label="Technician"
                    onPress={() => router.push('/approvals/technicians')}
                    value="T"
                  />
                  <SelectItem
                    label="Back Office"
                    onPress={() => router.push('/approvals/backoffices')}
                    value="B"
                  />
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/order')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <FontAwesome5 name="box" size={24} color="lightgray" />
              <Text className="font-worksans text-2xl text-gray-200">Your Orders</Text>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/learn')}
            className="flex w-full flex-row items-center justify-between rounded-lg bg-stone-800 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <AntDesign name="book" size={24} color="lightgray" />
              <Text className="font-worksans text-2xl text-gray-200">E-Learning</Text>
            </View>
            <Entypo name="chevron-small-right" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex w-full flex-row items-center justify-between rounded-lg bg-red-500/85 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              <Feather name="user-x" size={24} color="darkred" />
              <Text className="font-worksans text-2xl text-red-800">Delete Account</Text>
            </View>
            <Entypo name="chevron-small-right" size={24} color="darkred" />
          </TouchableOpacity>

          <View className="mt-2 flex h-[1px] w-full items-center justify-center bg-gray-300" />

          <TouchableOpacity
            onPress={handleLogout}
            disabled={loading}
            className="mt-2 flex w-full flex-row items-center justify-center rounded-lg bg-black/85 px-8 py-6">
            <View className="flex flex-row items-center justify-center gap-x-6">
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-2xl uppercase text-white">Logout</Text>
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
