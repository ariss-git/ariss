import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { isValidGSTIN } from '~/api/gstService';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '~/components/ui/checkbox';
import { CheckIcon } from '~/components/ui/icon';
import { useAuthStore } from '~/store/auth';

export default function RegisterDealerShipping() {
  const { gstin, setGstin, shippingAddress, setShippingAddress } = useAuthStore();
  const [localAddress, setLocalAddress] = useState(
    shippingAddress || { pncd: '', stcd: '', dst: '', loc: '', adr: '' }
  );
  const [gstValidated, setGstValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCityState = async (pincode: string) => {
    if (pincode.length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === 'Success') {
        const { State, District, Name } = data[0].PostOffice[0];
        setLocalAddress((prev) => ({ ...prev, stcd: State, dst: District, loc: Name }));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Pincode',
          text2: 'Please enter a valid 6-digit PIN code.',
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (!isValidGSTIN(gstin)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid GSTIN',
        text2: 'GSTIN format is incorrect.',
      });
      return;
    }

    if (!localAddress.pncd.trim() || localAddress.pncd.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Pincode',
        text2: 'Pincode must be 6 digits.',
      });
      return;
    }

    if (!localAddress.adr.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Address Required',
        text2: 'Please enter your full address.',
      });
      return;
    }

    setGstValidated(true);
    setShippingAddress(localAddress);
    router.push('/register/finalize');
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   className="flex-1 bg-black">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40 }}
          keyboardShouldPersistTaps="handled">
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.push('/register/name')} className="mb-6">
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

          {/* GSTIN Input */}
          <TextInput
            className="mb-10 mt-20 rounded-lg border border-white p-4 font-worksans text-white"
            placeholder="Enter GSTIN"
            placeholderTextColor="#999"
            value={gstin}
            onChangeText={setGstin}
            autoCapitalize="characters"
          />
          {gstValidated && (
            <Text className="mb-2 font-worksans text-green-400">GSTIN Validated</Text>
          )}

          {/* Shipping Address */}
          <Text className="mb-2 font-worksans text-2xl font-bold uppercase text-white">
            Shipping Address
          </Text>

          <View className="space-y-4">
            <View className="flex-row space-x-2">
              <TextInput
                className="m-2 max-w-24 flex-1 rounded-lg border border-white p-4 font-worksans text-white"
                placeholder="Pincode"
                placeholderTextColor="#999"
                value={localAddress.pncd}
                onChangeText={(text) => {
                  setLocalAddress({ ...localAddress, pncd: text });
                  if (text.length === 6) fetchCityState(text);
                }}
                keyboardType="number-pad"
              />
              {loading ? (
                <ActivityIndicator size="small" color="white" className="ml-2" />
              ) : (
                <TextInput
                  className="m-2 max-w-48 flex-1 rounded-lg border border-white p-4 font-worksans text-white"
                  placeholder="State"
                  placeholderTextColor="#999"
                  value={localAddress.stcd}
                  editable={false}
                />
              )}
            </View>

            <View className="flex-row space-x-2">
              <TextInput
                className="m-2 max-w-24 flex-1 rounded-lg border border-white p-4 font-worksans text-white"
                placeholder="City"
                placeholderTextColor="#999"
                value={localAddress.dst}
                editable={false}
              />
              <TextInput
                className="m-2 flex-1 rounded-lg border border-white p-4 font-worksans text-white"
                placeholder="Local Area"
                placeholderTextColor="#999"
                value={localAddress.loc}
                onChangeText={(text) => setLocalAddress({ ...localAddress, loc: text })}
              />
            </View>

            <TextInput
              className="m-2 rounded-lg border border-white p-4 font-worksans text-white"
              placeholder="Full Address"
              placeholderTextColor="#999"
              value={localAddress.adr}
              onChangeText={(text) => setLocalAddress({ ...localAddress, adr: text })}
            />
          </View>
          <View className="flex w-full flex-row items-center justify-start gap-x-2 bg-black p-2">
            <Text className="text-start font-worksans text-sm text-white/60">
              My Billing Address is same as Shipping Address
            </Text>
            <Checkbox value="check" size="md" isInvalid={false} isDisabled={false}>
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
            </Checkbox>
          </View>
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="absolute bottom-10 left-6 right-6 rounded-lg bg-white p-4">
          <Text className="text-center text-lg font-semibold uppercase text-black">Next</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
}
