import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';

import { backOfficeProfile, dealerProfile, technicianProfile } from '~/api/authServices';
import { createOrderAPI, verifyPaymentAPI } from '~/api/orderServices';
import { useAuthStore } from '~/store/auth';
import { useCartStore } from '~/store/cartStore';

const Cart = () => {
  const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { userType, setProfileData } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { token } = useAuthStore.getState();

        if (!token) {
          throw new Error('No token found, please log in again.');
        }

        let response;
        if (userType === 'DEALER') {
          response = await dealerProfile(token);
        } else if (userType === 'BACKOFFICE') {
          response = await backOfficeProfile(token);
        } else if (userType === 'TECHNICIAN') {
          response = await technicianProfile(token);
        }

        setProfileData(response?.data);
        setUserData(response?.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'Session expired, please log in again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userType, setProfileData]);

  const getFormattedAddress = () => {
    const addr =
      userType === 'DEALER' ? userData.shipping_address : userData.dealer.shipping_address;

    return `${addr.pncd}, ${addr.stcd}, ${addr.dst}, ${addr.loc}, ${addr.adr}`;
  };

  const handleIncrease = (item: any) => {
    addToCart({ ...item, quantity: 1 });
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

  const handleCheckout = async () => {
    try {
      const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      const orderData = {
        username: `${userData.first_name} ${userData.last_name}`,
        usertype: userData.usertype,
        business_name: userData.business_name,
        shipping_address: getFormattedAddress(),
        product_id: cartItems[0].id,
        total_amount: totalAmount,
        quantity: cartItems.reduce((total, item) => total + item.quantity, 0),
        coupon_code: '',
        delivery_date: new Date().toISOString(),
        payment_mode: 'ONLINE',
      };

      const { data: orderResponse } = await createOrderAPI(orderData);
      const { amount, id: orderId, currency } = orderResponse.data;

      const options = {
        description: 'Product Purchase',
        currency,
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
        amount: amount.toString(),
        order_id: orderId,
        name: 'YourApp',
        prefill: {
          email: userData.email || 'example@example.com',
          contact: userData.phone || '9999999999',
          name: `${userData.first_name} ${userData.last_name}`,
        },
        theme: { color: '#000000' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData: any) => {
          await verifyPaymentAPI({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          });
          Toast.show({ type: 'success', text1: 'Payment successful!' });
          useCartStore.setState({ cart: [] });
        })
        .catch((err: any) => {
          Toast.show({ type: 'error', text1: 'Payment cancelled or failed' });
          console.error('Payment Error:', err);
        });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to initiate payment' });
      console.error('Checkout Error:', error);
    }
  };

  const handleCredit = () => {
    console.log('Checkout with Credit');
    // Implement credit-based order flow
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
      <Image
        source={{ uri: item.image?.[0] ?? '' }}
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

  if (loading) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

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

      <View className="flex flex-col items-start justify-start gap-y-4 px-4 py-2">
        <Text>
          Name: {userData.first_name} {userData.last_name}
        </Text>
        <Text>UserType: {userData.usertype}</Text>
        <Text>Business: {userData.business_name}</Text>
        <Text>Shipping Address:</Text>
        {userType === 'DEALER' && (
          <View>
            <Text>{userData.shipping_address.pncd}</Text>
            <Text>{userData.shipping_address.stcd}</Text>
            <Text>{userData.shipping_address.dst}</Text>
            <Text>{userData.shipping_address.loc}</Text>
            <Text>{userData.shipping_address.adr}</Text>
          </View>
        )}
        {userType === 'BACKOFFICE' && (
          <View>
            <Text>{userData.dealer.shipping_address.pncd}</Text>
            <Text>{userData.dealer.shipping_address.stcd}</Text>
            <Text>{userData.dealer.shipping_address.dst}</Text>
            <Text>{userData.dealer.shipping_address.loc}</Text>
            <Text>{userData.dealer.shipping_address.adr}</Text>
          </View>
        )}
      </View>

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
