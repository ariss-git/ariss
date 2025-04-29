import { View, Text } from 'react-native';

import { useAuthStore } from '~/store/auth';

const Orders = () => {
  const { userType } = useAuthStore();
  return (
    <View className="flex min-h-screen w-full items-center justify-center">
      {userType === 'DEALER' && <Text>Orders</Text>}
      {userType === 'BACKOFFICE' && <Text>Orders</Text>}
      {userType === 'TECHNICIAN' && (
        <Text className="font-worksans text-stone-500">
          Oops, seems like technician cannot access this tab.
        </Text>
      )}
    </View>
  );
};

export default Orders;
