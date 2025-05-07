import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import { registerDealer } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

export default function RegisterSubmit() {
  const { phone, email, otp, firstName, lastName, userType, gstin, shippingAddress } =
    useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      console.log('Checking Zustand Data Before Submission:', { phone, email, otp });

      if (!phone || !email || !otp) {
        Toast.show({ type: 'error', text1: 'Phone, Email, or OTP is missing' });
        return;
      }

      if (!shippingAddress || !shippingAddress.pncd || !shippingAddress.stcd) {
        Toast.show({ type: 'error', text1: 'Incomplete shipping address' });
        return;
      }

      const dealerData = {
        phone,
        email,
        otp, // Now OTP will be present
        first_name: firstName,
        last_name: lastName,
        usertype: userType,
        gstin,
        pncd: shippingAddress.pncd,
        loc: shippingAddress.loc,
        dst: shippingAddress.dst,
        stcd: shippingAddress.stcd,
        adr: shippingAddress.adr,
      };

      console.log('Sending Data:', dealerData);

      const { data } = await registerDealer(dealerData);

      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Please wait until account is approved.',
          text2: `Message sent to ${email} `,
        });
        router.replace('/login');
      } else {
        Toast.show({ type: 'error', text1: 'Registration failed, account already exists.' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Registration failed.' });
      console.error('Registration Error:', error);
    }
    setLoading(false);
  };

  return (
    <ScrollView
      className="h-full w-full bg-black"
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <View className="flex-1 flex-col gap-y-6">
        {/* Header */}
        <Text className="mt-10 font-worksans text-3xl font-bold uppercase text-white">
          Review & Submit
        </Text>

        {/* Phone & Email */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">Phone</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="font-worksans text-white">+91{phone}</Text>
          </View>
        </View>
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">Email</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="font-worksans text-white">{email}</Text>
          </View>
        </View>

        {/* Personal Details */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">First Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="font-worksans text-white">{firstName}</Text>
          </View>
        </View>
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">Last Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="font-worksans text-white">{lastName}</Text>
          </View>
        </View>
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">User Type</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="font-worksans text-white">{userType}</Text>
          </View>
        </View>

        {/* GSTIN */}
        <View>
          <Text className="font-worksans text-lg font-semibold text-white">GSTIN</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="font-worksans text-white">{gstin || 'N/A'}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <Text className="font-worksans text-lg font-semibold text-white">Shipping Address</Text>
        <View className="space-y-4">
          <View className="flex-row space-x-2">
            <View className="m-2 flex-1 rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
              <Text className="text-gray-300">Pincode</Text>
              <Text className="font-worksans text-white">{shippingAddress?.pncd || 'N/A'}</Text>
            </View>
            <View className="m-2 flex-1 rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
              <Text className="text-gray-300">State</Text>
              <Text className="font-worksans text-white">{shippingAddress?.stcd || 'N/A'}</Text>
            </View>
          </View>
          <View className="m-2 rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="text-gray-300">City</Text>
            <Text className="font-worksans text-white">{shippingAddress?.dst || 'N/A'}</Text>
          </View>
          <View className="m-2 rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="text-gray-300">Local Area</Text>
            <Text className="font-worksans text-white">{shippingAddress?.loc || 'N/A'}</Text>
          </View>
          <View className="m-2 rounded-lg border border-gray-400 px-6 py-4 font-worksans text-white shadow-md">
            <Text className="text-gray-300">Full Address</Text>
            <Text className="font-worksans text-white">{shippingAddress?.adr || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        className="mt-10 w-full rounded-lg bg-white px-6 py-4 shadow-md"
        disabled={loading}>
        <Text className="text-center text-lg font-semibold uppercase text-black">
          {loading ? (
            <ActivityIndicator
              className="flex w-full items-center justify-center text-center"
              size="small"
              color="black"
            />
          ) : (
            'Register'
          )}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
