import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

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

export default function RegisterName() {
  const { firstName, setFirstName, lastName, setLastName, userType, setUserType } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!firstName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'First Name Required',
        text2: 'Please enter your first name.',
      });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Last Name Required',
        text2: 'Please enter your last name.',
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
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay

      if (userType === 'DEALER') {
        router.push('/register/gstin');
      } else if (userType === 'TECHNICIAN') {
        router.push('/register/technician/id-verification');
      } else if (userType === 'BACKOFFICE') {
        router.push('/register/back-office/id-verification');
      } else {
        router.push('/+not-found');
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

  const paddingClass = Platform.OS === 'ios' ? 'p-4' : 'p-0 px-2 py-1';

  return (
    <View className="flex-1 justify-between bg-black px-6 py-10">
      <View>
        <TouchableOpacity
          className="px-4 py-10"
          onPress={() => router.push('/register/verify-otp')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View>
        <View
          className={`my-4 flex-row items-center rounded-xl border border-gray-500 p-4 ${paddingClass}`}>
          <TextInput
            className="flex-1 font-worksans text-white"
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
            keyboardType="default"
          />
        </View>

        <View
          className={`my-4 flex-row items-center rounded-xl border border-gray-500 p-4 ${paddingClass}`}>
          <TextInput
            className="flex-1 font-worksans text-white"
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
            keyboardType="default"
          />
        </View>

        {/* Updated User Type Dropdown */}
        <View className="my-4 rounded-lg p-2">
          <Select onValueChange={(val) => setUserType(val as UserType)} selectedValue={userType}>
            <SelectTrigger className="rounded-xl bg-transparent px-4 py-3">
              <SelectInput
                style={{
                  color: 'white',
                  fontFamily: 'WorkSans',
                  paddingVertical: Platform.OS === 'android' ? 8 : 0,
                  height: 48,
                  textAlignVertical: 'center',
                }}
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

      <View>
        <TouchableOpacity
          className="rounded-xl bg-white p-4 shadow-md"
          onPress={handleNext}
          disabled={loading}>
          <Text className="text-center text-lg font-semibold uppercase text-black">
            {loading ? (
              <ActivityIndicator
                size="small"
                className="flex w-full items-center justify-center text-center"
                color="black"
              />
            ) : (
              'Next'
            )}
          </Text>
        </TouchableOpacity>

        <Text className="mt-4 text-center font-worksans text-neutral-500">
          Already have an account?{' '}
          <Text
            className="font-worksans font-semibold text-orange-500"
            onPress={() => router.push('/login')}>
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
}
