// import AntDesign from '@expo/vector-icons/AntDesign';
import { AntDesign } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
// import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { dealerProfile } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { token } = useAuthStore.getState(); // Get token from Zustand store

        if (!token) {
          throw new Error('No token found, please log in again.');
        }

        const response = await dealerProfile(token);

        console.log('API Response:', response.data); // Debugging API Response
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'Session expired, please log in again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    console.log('Logging out...');
    await logout();
    console.log('Logout completed, routing to login');
    router.replace('/login');
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'ID copied to clipboard.',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-worksans text-lg text-black">Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="h-full w-full bg-white"
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <View className="flex w-full flex-row items-center justify-start">
        <TouchableOpacity className="px-4 py-10" onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="my-6 font-worksans text-2xl font-bold uppercase text-black">
          Your Profile
        </Text>
      </View>
      <View className="flex-1 flex-col gap-y-6">
        {/* ID */}
        <View>
          <Text className="mt-2 font-worksans text-lg font-semibold text-black">Your ID</Text>
          <View className="mt-2 flex-row items-center justify-between rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">{userData.dealer_id}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(userData.dealer_id)}>
              <Feather name="copy" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <View>
          <Text className="mt-2 font-worksans text-lg font-semibold text-black">Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">
              {userData.first_name} {userData.last_name}
            </Text>
          </View>
        </View>

        {/* Business Name */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-black">Business Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">{userData.business_name || 'N/A'}</Text>
          </View>
        </View>

        {/* Contact */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-black">Contact</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">{userData.phone}</Text>
          </View>
        </View>

        {/* Email */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-black">Email</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">{userData.email}</Text>
          </View>
        </View>

        {/* GSTIN */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-black">GSTIN</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-200 px-6 py-4">
            <Text className="font-worksans text-black">{userData.gstin || 'N/A'}</Text>
          </View>
        </View>

        {/* Billing Address */}
        <Text className="font-worksans text-lg font-semibold text-black">Billing Address</Text>
        {userData.billing_address ? (
          <View className="space-y-4">
            <View className="flex-row space-x-2">
              <View className="m-1 flex-1 rounded-lg border border-gray-200 px-6 py-4">
                <Text className="text-gray-500">Pincode</Text>
                <Text className="font-worksans text-black">
                  {userData.billing_address.pncd || 'N/A'}
                </Text>
              </View>
              <View className="m-1 flex-1 rounded-lg border border-gray-200 px-6 py-4">
                <Text className="text-gray-500">State</Text>
                <Text className="font-worksans text-black">
                  {userData.billing_address.stcd || 'N/A'}
                </Text>
              </View>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">Street</Text>
              <Text className="font-worksans text-black">
                {userData.billing_address.st || 'N/A'}
              </Text>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">City</Text>
              <Text className="font-worksans text-black">
                {userData.billing_address.dst || 'N/A'}
              </Text>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">Local Area</Text>
              <Text className="font-worksans text-black">
                {userData.billing_address.loc || 'N/A'}
              </Text>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">Full Address</Text>
              <Text className="font-worksans text-black">
                {userData.billing_address.adr || 'N/A'}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-500">No billing address available</Text>
        )}

        {/* Shipping Address */}
        <Text className="font-worksans text-lg font-semibold text-black">Shipping Address</Text>
        {userData.shipping_address ? (
          <View className="space-y-4">
            <View className="flex-row space-x-2">
              <View className="m-1 flex-1 rounded-lg border border-gray-200 px-6 py-4">
                <Text className="text-gray-500">Pincode</Text>
                <Text className="font-worksans text-black">
                  {userData.shipping_address.pncd || 'N/A'}
                </Text>
              </View>
              <View className="m-1 flex-1 rounded-lg border border-gray-200 px-6 py-4">
                <Text className="text-gray-500">State</Text>
                <Text className="font-worksans text-black">
                  {userData.shipping_address.stcd || 'N/A'}
                </Text>
              </View>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">City</Text>
              <Text className="font-worksans text-black">
                {userData.shipping_address.dst || 'N/A'}
              </Text>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">Local Area</Text>
              <Text className="font-worksans text-black">
                {userData.shipping_address.loc || 'N/A'}
              </Text>
            </View>
            <View className="m-1 rounded-lg border border-gray-200 px-6 py-4">
              <Text className="text-gray-500">Full Address</Text>
              <Text className="font-worksans text-black">
                {userData.shipping_address.adr || 'N/A'}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-500">No shipping address available</Text>
        )}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 w-full rounded-lg bg-black px-6 py-4"
          disabled={loading}
          style={{ alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Logout</Text>
          )}
        </TouchableOpacity>
        <Text className="px-2 text-center text-orange-500">
          To update your details please contact sales person
        </Text>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
