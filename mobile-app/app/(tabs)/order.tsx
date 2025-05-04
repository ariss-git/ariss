import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// import { useAuthStore } from '~/store/auth';

const Orders = () => {
  // const { userType } = useAuthStore();
  const router = useRouter();
  return (
    <View className="w-full flex-1 bg-stone-200">
      <View className="flex-row items-center justify-between bg-black px-4 py-3">
        <TouchableOpacity onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-posterama text-lg font-semibold uppercase text-white">
          Your Orders
        </Text>
        <View className="w-6" />
      </View>
      <View className="bg-black px-6 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 46 }}>
          <Text className="font-worksans font-extrabold uppercase text-stone-200">Pending</Text>
          <Text className="font-worksans font-extrabold uppercase text-stone-200">Placed</Text>
          <Text className="font-worksans font-extrabold uppercase text-stone-200">Dispatched</Text>
          <Text className="font-worksans font-extrabold uppercase text-stone-200">Delivered</Text>
          <Text className="font-worksans font-extrabold uppercase text-stone-200">Ledger</Text>
        </ScrollView>
      </View>
      <View className="bg-transparent">
        <ScrollView
          className="flex min-h-screen flex-1 flex-col gap-y-10 "
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Hello</Text>
        </ScrollView>
      </View>
    </View>
    // <View className="flex min-h-screen w-full items-center justify-center">
    //   {userType === 'DEALER' && <Text>Orders</Text>}
    //   {userType === 'BACKOFFICE' && <Text>Orders</Text>}
    //   {userType === 'TECHNICIAN' && (
    //     <Text className="font-worksans text-stone-500">
    //       Oops, seems like technician cannot access this tab.
    //     </Text>
    //   )}
    // </View>
  );
};

export default Orders;
