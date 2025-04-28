import { useRouter } from 'expo-router';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

const Approval = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      {/* Top Tabs */}
      <View className="w-full flex-row bg-stone-200">
        {/* Inactive Tab - Technicians */}
        <TouchableOpacity
          onPress={() => router.push('/approvals')}
          className="flex-1 items-center justify-center py-4">
          <Text className="font-worksans text-lg font-semibold text-stone-500">Technician</Text>
        </TouchableOpacity>

        {/* Active Tab - Back Office */}
        <TouchableOpacity
          onPress={() => router.push('/approvals/backoffices')}
          className="flex-1 items-center justify-center border-b-4 border-black bg-white py-4">
          <Text className="font-worksans text-lg font-extrabold text-black">Back Office</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        <View className="flex min-h-screen w-full flex-col items-start justify-start gap-y-6 bg-stone-100 p-4">
          <Text className="text-xl text-black">Hi</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Approval;
