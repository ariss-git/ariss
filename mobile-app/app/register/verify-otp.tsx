import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '~/store/auth';

export default function VerifyOTP() {
  const { otp, phone, email } = useAuthStore();
  const { setPhone, setEmail, setOtp: setRegisterOtp } = useAuthStore(); // Sync with register store
  const [localOtp, setLocalOtp] = useState(otp);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!localOtp.trim()) {
      Toast.show({
        type: 'error',
        text1: 'OTP Required',
        text2: 'Please enter the 6-digit OTP.',
      });
      return;
    }

    if (localOtp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'OTP must be exactly 6 digits.',
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 sec

      // ✅ Store verified data in register store
      setPhone(phone);
      setEmail(email);
      setRegisterOtp(localOtp); // Store OTP in Zustand before proceeding

      router.push('/register/name');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again.',
      });
      console.error('Error redirecting to names', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-between bg-black px-6 py-10">
        <View>
          <TouchableOpacity className="px-4 py-10" onPress={() => router.push('/login')}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="mb-2 font-worksans text-4xl font-bold uppercase text-white">
            Verify OTP
          </Text>
          <Text className="mb-6 font-worksans text-neutral-500">
            OTP has been sent to your mobile and email.
          </Text>

          <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4">
            <TextInput
              className="flex-1 font-worksans text-white"
              placeholder="6 digit OTP"
              placeholderTextColor="#999"
              value={localOtp}
              onChangeText={setLocalOtp}
              keyboardType="numeric"
              maxLength={6} // Prevents input longer than 6 digits
            />
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="rounded-xl bg-white p-4 shadow-md"
            onPress={handleNext}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator
                className="flex w-full items-center justify-center text-center"
                size="small"
                color="black"
              />
            ) : (
              <Text className="text-center text-lg font-semibold uppercase text-black">Next</Text>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-center font-worksans text-neutral-500">
            Didn't receive the OTP?{' '}
            <Text className="font-worksans font-semibold text-orange-500">Resend</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
