import AntDesign from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard'; // Import Clipboard API
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

import { sendOTP } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

export default function DealerIdVerification() {
  const { dealerId, setDealerId, phone, email } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!dealerId) {
      Toast.show({
        type: 'error',
        text1: 'Dealer ID is Required',
        text2: 'Please enter your business dealer ID.',
      });
      return;
    }
    try {
      setLoading(true);

      try {
        setLoading(true);
        const formattedPhone = `+91${phone}`;
        const { data } = await sendOTP(formattedPhone, email);

        if (data.success) {
          router.push('/register/technician/verify-otp');
        } else {
          Toast.show({
            type: 'error',
            text1: 'OTP Error',
            text2: data.message || 'Failed to send OTP. Try again.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error Sending OTP',
          text2: 'Please try again later.',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again.',
      });
      console.error('Error redirecting:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to paste Dealer ID from clipboard
  const handlePaste = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    if (clipboardContent) {
      setDealerId(clipboardContent);
      Toast.show({
        type: 'success',
        text1: 'Pasted from Clipboard',
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Clipboard is empty',
      });
    }
  };

  return (
    <View className="flex-1 justify-between bg-black px-6 py-10">
      <View>
        <TouchableOpacity className="px-4 py-10" onPress={() => router.push('/register/name')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Dealer ID Input with Paste Button */}
      <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4">
        <TextInput
          className="flex-1 text-white"
          placeholder="Approved Dealer ID"
          placeholderTextColor="#999"
          value={dealerId}
          onChangeText={setDealerId}
          keyboardType="default"
        />
        <TouchableOpacity onPress={handlePaste} className="ml-2">
          <AntDesign name="copy1" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          className="rounded-xl bg-white p-4 shadow-md"
          onPress={handleNext}
          disabled={loading}>
          <Text className="text-center text-lg font-semibold text-black">
            {loading ? <ActivityIndicator size="small" color="black" /> : 'Next'}
          </Text>
        </TouchableOpacity>

        <Text className="mt-4 text-center text-neutral-500">
          Already have an account?{' '}
          <Text className="font-semibold text-orange-500" onPress={() => router.push('/login')}>
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
}
