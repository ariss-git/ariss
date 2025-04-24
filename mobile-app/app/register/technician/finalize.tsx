import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import { registerTechnician } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

export default function TechnicianSubmit() {
  const { phone, email, otp, firstName, lastName, userType, dealerId } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      console.log('Checking Zustand Data Before Submission:', { phone, email, otp });

      if (!phone || !email || !otp) {
        Toast.show({ type: 'error', text1: 'Phone, Email, or OTP is missing' });
        return;
      }

      const techData = {
        phone,
        email,
        otp,
        first_name: firstName,
        last_name: lastName,
        usertype: userType,
        dealerId,
      };

      console.log('Sending Data:', techData);

      const { data } = await registerTechnician(techData);

      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Congratulations! Your technician account has created.',
          text2: `Message sent to ${phone} and ${email} `,
        });
        router.replace('/login');
      } else {
        Toast.show({ type: 'error', text1: 'Registration failed.' });
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
        <Text className="text-3xl font-bold text-white">Review & Submit</Text>

        {/* Phone & Email */}
        <View>
          <Text className="text-lg font-semibold text-white">Phone</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{phone}</Text>
          </View>
        </View>
        <View>
          <Text className="text-lg font-semibold text-white">Email</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{email}</Text>
          </View>
        </View>

        {/* Personal Details */}
        <View>
          <Text className="text-lg font-semibold text-white">First Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{firstName}</Text>
          </View>
        </View>
        <View>
          <Text className="text-lg font-semibold text-white">Last Name</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{lastName}</Text>
          </View>
        </View>
        <View>
          <Text className="text-lg font-semibold text-white">User Type</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{userType}</Text>
          </View>
        </View>

        {/* GSTIN */}
        <View>
          <Text className="text-lg font-semibold text-white">Dealer ID</Text>
          <View className="mt-2 w-full rounded-lg border border-gray-400 px-6 py-4 text-white shadow-md">
            <Text className="text-white">{dealerId}</Text>
          </View>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        className="mt-6 w-full rounded-lg bg-white px-6 py-4 shadow-md"
        disabled={loading}>
        <Text className="text-center text-lg font-semibold text-black">
          {loading ? <ActivityIndicator size="small" color="black" /> : 'Register'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
