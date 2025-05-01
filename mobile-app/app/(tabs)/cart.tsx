import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';

import { useCartStore } from '~/store/cartStore';

const Cart = () => {
  const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();

  const handleIncrease = (item: any) => {
    addToCart({ ...item, quantity: 1 }); // will just push another same item
  };

  const handleDecrease = (item: any) => {
    if (item.quantity > 1) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      );
      useCartStore.setState({ cart: updatedCart });
    } else {
      removeFromCart(item.id);
    }
  };

  const handleCheckout = () => {
    console.log('Checkout with Razorpay');
  };

  const handleCredit = () => {
    console.log('Checkout with Credit');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
      <Image
        source={{ uri: item.image?.[0] ?? '' }} // safely get first image
        className="h-20 w-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />

      <View className="ml-4 flex-1">
        <Text className="font-worksans text-lg font-bold text-black">{item.name}</Text>
        <Text className="text-gray-600">₹ {item.price}</Text>
        <View className="mt-2 flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => handleDecrease(item)}>
            <AntDesign name="minuscircleo" size={20} color="black" />
          </TouchableOpacity>
          <Text className="font-worksans text-black">{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item)}>
            <AntDesign name="pluscircleo" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <AntDesign name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between bg-black px-4 py-3">
        <TouchableOpacity onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-posterama text-lg font-semibold uppercase text-white">Your Cart</Text>
        <View className="w-6" />
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Cart Summary */}
      <View className="bg-gray-100 px-4 py-2">
        <Text className="font-worksans text-lg font-bold text-black">
          Total: ₹ {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </Text>
      </View>

      {/* Buttons */}
      <View className="flex-row gap-x-4 px-4 py-4">
        <TouchableOpacity
          onPress={handleCheckout}
          className="flex-1 items-center justify-center rounded-lg bg-black py-4">
          <Text className="text-xl font-bold text-white">Checkout</Text>
          <Feather name="credit-card" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCredit}
          className="flex-1 items-center justify-center rounded-lg bg-gray-300 py-4">
          <Text className="text-xl font-bold text-black">Credit</Text>
          <Feather name="credit-card" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
