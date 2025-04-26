import { Feather, AntDesign } from '@expo/vector-icons';
import axios from 'axios'; // Axios for API calls
import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay'; // Import Razorpay

import { useCartStore } from '~/store/cartStore'; // Zustand cart store

const API_BASE_URL = 'https://ariss-production.up.railway.app/api'; // Your backend base URL

// Cart Screen Component
const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      // 1. Create Order on Backend
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        dealer_id: '909d5f55-5403-4f0a-bdbf-f0f157d85499', // ❗ TODO: Replace with actual logged-in dealer id
        cart: cart.map((item) => ({
          product_id: item.id, // Assuming item.id is product_id
          quantity: item.quantity,
        })),
        payment_mode: 'ONLINE',
        total_amount: calculateTotal(),
      });

      const { razorpayOrder } = response.data; // Get razorpay order info

      // 2. Open Razorpay checkout
      const options = {
        description: 'Payment for your order',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_2IRbtJ4XoL6vJQ', // Your Razorpay Key
        amount: razorpayOrder.amount, // Amount in paise
        order_id: razorpayOrder.id, // Razorpay Order ID
        name: 'Your App Name',
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: { color: '#F37254' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          // 3. Verify payment
          await axios.post(`${API_BASE_URL}/verify-payment`, {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          });

          Alert.alert('Success', 'Payment successful!');
          clearCart(); // Clear cart after successful payment
        })
        .catch((error) => {
          console.error('Payment Failed', error);
          Alert.alert('Error', 'Payment failed. Please try again.');
        });
    } catch (error) {
      console.error('Error', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreditPurchase = async () => {
    try {
      setLoading(true);

      // Create Order with Credit Mode
      await axios.post(`${API_BASE_URL}/orders`, {
        dealer_id: '909d5f55-5403-4f0a-bdbf-f0f157d85499', // ❗ TODO: Replace with actual dealer id
        cart: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_mode: 'CREDIT',
        total_amount: calculateTotal(),
      });

      Alert.alert('Success', 'Order placed on credit!');
      clearCart();
    } catch (error) {
      console.error('Credit Purchase Error', error);
      Alert.alert('Error', 'Could not place credit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="w-full bg-black p-4">
        <Text className="text-2xl font-bold text-white">Shopping Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Your cart is empty!</Text>
        </View>
      ) : (
        <View className="flex-1 p-4">
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center">
                  <Feather name="shopping-cart" size={24} color="black" />
                  <Text className="ml-4 font-semibold">{item.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-semibold">₹ {item.price * item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className="ml-4">
                    <AntDesign name="delete" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          <View className="flex-row items-center justify-between py-4">
            <Text className="text-lg font-semibold">Total:</Text>
            <Text className="text-lg font-semibold">₹ {calculateTotal()}</Text>
          </View>

          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity
              className="mr-2 flex-1 rounded-lg bg-black p-4"
              onPress={handleOnlinePayment}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-center font-bold text-white">Purchase Online</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2 flex-1 rounded-lg bg-gray-800 p-4"
              onPress={handleCreditPurchase}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-center font-bold text-white">Purchase on Credit</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={clearCart}
            className="mt-4 items-center rounded-lg bg-red-500 py-3">
            <Text className="font-bold text-white">Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;
