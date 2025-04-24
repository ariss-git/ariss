import { View, ActivityIndicator } from 'react-native';

const Cart = () => {
  return (
    <View className="flex min-h-screen w-full items-center justify-center">
      <ActivityIndicator
        className="flex w-full items-center justify-center text-center"
        size="large"
        color="black"
      />
    </View>
  );
};

export default Cart;
