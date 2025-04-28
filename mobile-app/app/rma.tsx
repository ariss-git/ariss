import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { dealerProfile } from '~/api/authServices';
import { fileRMA } from '~/api/rmaServices';
import Header from '~/components/Header';
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
import { useAuthStore } from '~/store/auth';

interface RMATypes {
  first_name: string;
  last_name: string;
  business_name: string;
  gstin: string;
  phone: string;
  email: string;
  user_type: string;
  product_name: string;
  product_serial: string;
  product_issue: string;
  product_images: string[];
}

type UserType = 'DEALER' | 'TECHNICIAN' | 'BACKOFFICE';

const RMA = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productSerial, setProductSerial] = useState<string>('');
  const [productIssue, setProductIssue] = useState<string>('');
  const [userType, setUserType] = useState<UserType | ''>('');
  const { token } = useAuthStore.getState();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await dealerProfile(token!);
        setUserData(user.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleRMASubmit = async () => {
    if (!userType) {
      Toast.show({
        type: 'error',
        text1: 'User Type is required',
        text2: 'Please select your user type',
      });
      return;
    }

    if (!productName) {
      Toast.show({
        type: 'error',
        text1: 'Product Name is required',
        text2: 'Please enter your product name',
      });
      return;
    }

    if (!productSerial) {
      Toast.show({
        type: 'error',
        text1: 'Serial Number is required',
        text2: 'Please enter your product serial number',
      });
      return;
    }

    if (!productIssue) {
      Toast.show({
        type: 'error',
        text1: 'Product Issue is required',
        text2: 'Please describe the issue you are facing',
      });
      return;
    }

    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'Product Image is required',
        text2: 'Please upload an image of the product',
      });
      return;
    }

    setLoading(true);

    const rmaData: RMATypes = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      business_name: userData.business_name,
      gstin: userData.gstin,
      phone: userData.phone,
      email: userData.email,
      user_type: userType,
      product_name: productName,
      product_serial: productSerial,
      product_issue: productIssue,
      product_images: [image],
    };

    try {
      const response = await fileRMA(rmaData);
      console.log('RMA submitted successfully:', response.data);
      Toast.show({
        type: 'success',
        text1: 'We have received your RMA.',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('RMA Submission Failed:', error.response?.data);
        Toast.show({
          type: 'error',
          text1: 'Your RMA is already in progress',
          text2: 'We have already received your RMA Request.',
        });
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      console.log('Permission to access media library was denied');
    }
  };

  if (!token) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center">
        <Text className="font-worksans text-xl text-red-500">User is not authenticated</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="w-full flex-1 bg-white">
        <ScrollView>
          <View className="flex w-full flex-row items-center justify-start">
            <TouchableOpacity className="px-4 py-10" onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text className="my-6 font-worksans text-2xl font-bold uppercase text-black">
              RMA Request Form
            </Text>
          </View>
          <View className="flex w-full flex-col items-start justify-start gap-y-8 px-6 py-4">
            <View className="my-4 w-full rounded-xl p-2">
              <Select
                onValueChange={(val: string) => setUserType(val as UserType)}
                selectedValue={userType}>
                <SelectTrigger className="rounded-xl border border-gray-400 bg-transparent px-4 py-3">
                  <SelectInput
                    placeholder="Select User Type"
                    placeholderTextColor="#999"
                    className="font-worksans text-black"
                  />
                  <SelectIcon className="absolute right-2 text-black" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent className="z-50 border border-gray-600 bg-stone-800">
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

            <View className="flex w-full flex-col gap-y-2">
              <Text className="font-worksans text-xl font-semibold text-black">Product Name</Text>
              <TextInput
                className="w-full rounded-lg border px-6 py-4 font-worksans text-black"
                placeholder="ARISS-xQf3.2 Router"
                value={productName}
                onChangeText={setProductName}
              />
            </View>
            <View className="flex w-full flex-col gap-y-2">
              <Text className="font-worksans text-xl font-semibold text-black">Serial Number</Text>
              <TextInput
                className="w-full rounded-lg border px-6 py-4 font-worksans text-black"
                placeholder="1234-5678-ABCD"
                value={productSerial}
                onChangeText={setProductSerial}
              />
            </View>
            <View className="flex w-full flex-col gap-y-2">
              <Text className="font-worksans text-xl font-semibold text-black">
                Describe your issue
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                className="w-full rounded-lg border px-6 py-4 font-worksans text-black"
                placeholder="Write your product issue here..."
                style={{
                  height: 150,
                  textAlignVertical: 'top',
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
                value={productIssue}
                onChangeText={setProductIssue}
              />
            </View>
            <View className="flex w-full flex-col gap-y-2">
              <Text className="font-worksans text-xl font-semibold text-black">
                Upload Product Image
              </Text>
              <TouchableOpacity onPress={handlePickImage} className="rounded-lg bg-gray-200 p-4">
                <Text className="font-worksans text-lg text-black">Pick an Image</Text>
              </TouchableOpacity>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, marginTop: 10, borderRadius: 8 }}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={handleRMASubmit}
              className="mt-6 w-full rounded-lg bg-stone-800 p-4"
              disabled={loading}>
              {loading ? (
                <ActivityIndicator
                  color="white"
                  size="small"
                  className="flex w-full items-center justify-center text-center"
                />
              ) : (
                <Text className="text-center text-xl font-semibold uppercase text-white">
                  Submit RMA
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RMA;
