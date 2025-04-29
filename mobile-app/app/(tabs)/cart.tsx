import { View, Text } from 'react-native';

import { useAuthStore } from '~/store/auth';

const Cart = () => {
  const { userType } = useAuthStore();
  return (
    <View className="flex min-h-screen w-full items-center justify-center">
      {userType === 'DEALER' && <Text>Cart</Text>}
      {userType === 'BACKOFFICE' && <Text>Cart</Text>}
      {userType === 'TECHNICIAN' && (
        <Text className="font-worksans text-stone-500">
          Oops, seems like technician cannot access this tab.
        </Text>
      )}
    </View>
  );
};

export default Cart;
