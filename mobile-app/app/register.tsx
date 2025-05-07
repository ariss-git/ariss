import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';

// import { sendOTP } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

const RegisterSendOTP = () => {
  const { setPhone, setEmail, phone, email } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Ensure +91 is always prefixed to phone
  const formatPhoneNumber = (input: string) => {
    return input.replace(/\D/g, '').slice(0, 10); // Only 10 digits, no +91 here
  };

  const isValidEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Phone Number required',
        text2: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email Address',
        text2: 'Please enter a valid email.',
      });
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/register/name');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error Sending OTP',
        text2: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }

    // try {
    //   setLoading(true);
    //   const formattedPhone = `+91${phone}`;
    //   const { data } = await sendOTP(formattedPhone, email);

    //   if (data.success) {
    //     router.push('/register/verify-otp');
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'OTP Error',
    //       text2: data.message || 'Failed to send OTP. Try again.',
    //     });
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error Sending OTP',
    //     text2: 'Please try again later.',
    //   });
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-between bg-black px-6 py-10">
        {/* <Text className="mt-10 text-center font-posterama text-6xl font-extrabold text-white">
          ARISS
        </Text> */}

        <View className="flex w-full items-center justify-center">
          <Image source={require('../assets/1.png')} className="h-64 w-64" />
        </View>

        <View>
          <Text className="mb-2 font-worksans text-3xl font-bold uppercase text-white">
            Sign Up
          </Text>
          <Text className="mb-2 font-worksans text-neutral-500">
            Join our family in just few steps.
          </Text>

          {/* Mobile Number Input with +91 prefix */}
          <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4">
            <View className="mr-2 w-[50px]">
              <Text className="text-center font-worksans text-white">+91</Text>
            </View>
            <TextInput
              className="flex-1 font-worksans text-white"
              placeholder="Mobile Number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={(text) => setPhone(formatPhoneNumber(text))}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          <View className="mb-6 flex-row items-center rounded-xl border border-gray-500 p-4">
            <TextInput
              className="flex-1 font-worksans text-white"
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <TouchableOpacity className="rounded-xl bg-white p-4 shadow-md" onPress={handleSendOTP}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text className="text-center text-lg font-semibold text-black">Next</Text>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-center font-worksans text-neutral-500">
            Already have an account?{' '}
            <Text
              className="font-worksans font-semibold text-orange-500"
              onPress={() => router.push('/login')}>
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterSendOTP;
