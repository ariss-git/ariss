import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { sendOTP, verifyOTP } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

export default function VerifyOTP() {
  const { email, phone, setOtp, otp, setToken, userType, loadToken, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadToken(); // Load token on component mount
  }, []);

  useEffect(() => {
    if (token) {
      router.replace('/'); // Redirect to home if authenticated
    }
  }, [token]);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const formattedPhone = phone;
      const { data } = await sendOTP(formattedPhone, email);

      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: 'Check your mobile and email.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Resend OTP',
          text2: data.message || 'Please try again.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to resend OTP. Try again later.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 6-digit OTP.',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Sending OTP verification request:', { phone, email, otp, userType });

      const response = await verifyOTP(phone, email, otp, userType);
      console.log('API Response:', response.data);

      if (response.data.success) {
        console.log('OTP verified, saving token...');
        await setToken(response.data.token); // Store the token properly

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome to ARISS app.',
        });

        router.replace('/');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: response.data.message || 'OTP verification failed.',
        });
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: 'Invalid or expired OTP.',
      });
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

          <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4 font-worksans">
            <TextInput
              className="flex-1 font-worksans text-white"
              placeholder="6 digit OTP"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="rounded-lg bg-white p-4 shadow-md"
            onPress={handleVerifyOTP}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator
                size="small"
                className="flex w-full items-center justify-center text-center"
                color="black"
              />
            ) : (
              <Text className="text-center text-lg font-semibold uppercase text-black">Login</Text>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-center font-worksans text-neutral-500">
            Didn't receive the OTP?{' '}
            <Text className="font-worksans font-semibold text-orange-500" onPress={handleSendOTP}>
              Resend
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
