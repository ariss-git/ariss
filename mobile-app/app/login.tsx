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
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { sendOTP } from '~/api/authServices';
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
import { useAuthStore, UserType } from '~/store/auth';

export default function Login() {
  const { setPhone, setEmail, phone, email, userType, setUserType, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (input: string) => {
    return input.replace(/\D/g, '').slice(0, 10); // Just 10-digit raw input
  };

  const isValidEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleSendOTP = async () => {
    if (!phone) {
      Toast.show({
        type: 'error',
        text1: 'Phone Number is required',
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
      return;
    }

    if (!userType) {
      Toast.show({
        type: 'error',
        text1: 'User Type Required',
        text2: 'Please select a user type before proceeding.',
      });
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+91${phone}`;
      const { data } = await sendOTP(formattedPhone, email);

      if (data.success) {
        router.push('/login/verify-otp');
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
          <Text
            className="mb-2 font-worksans text-3xl font-bold uppercase text-white"
            onPress={logout}>
            Sign In
          </Text>
          <Text className="mb-2 font-worksans text-neutral-500">
            Welcome back, password-less login just for you.
          </Text>

          {/* Mobile Number Input with +91 prefix */}
          <View className="my-4 flex-row items-center rounded-xl border border-gray-500 p-4">
            <View className="mr-2 w-[50px]">
              <TextInput
                className="text-center font-worksans text-white"
                value="+91"
                editable={false}
                selectTextOnFocus={false}
              />
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

          {/* Email Input */}
          <View className="my-2 flex-row items-center rounded-xl border border-gray-500 p-4">
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

          {/* User Type Select */}
          <View className="my-2 rounded-xl p-2">
            <Select onValueChange={(val) => setUserType(val as UserType)} selectedValue={userType}>
              <SelectTrigger className="rounded-xl bg-transparent px-4 py-3">
                <SelectInput
                  placeholder="Select User Type"
                  placeholderTextColor="#999"
                  className="font-worksans text-white"
                />
                <SelectIcon className="absolute right-2 text-white" as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="z-50 border border-gray-600 bg-black">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Dealer" value="DEALER" />
                  <SelectItem label="Technician" value="TECHNICIAN" />
                  <SelectItem label="Back Office" value="BACKOFFICE" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>
        </View>

        {/* Send OTP */}
        <View>
          <TouchableOpacity
            className="rounded-xl bg-white p-4 shadow-md"
            onPress={handleSendOTP}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text className="text-center text-lg font-semibold uppercase text-black">
                Send OTP
              </Text>
            )}
          </TouchableOpacity>

          <Text className="mt-4 text-center font-worksans text-neutral-500">
            Don't have an account?{' '}
            <Text
              className="font-worksans font-semibold text-orange-500"
              onPress={() => router.push('/register')}>
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
