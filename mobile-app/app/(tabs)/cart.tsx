// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';

// import { dealerProfile } from '~/api/authServices';
// import { useAuthStore } from '~/store/auth';
// import { useCartStore } from '~/store/cartStore';

// export default function CartScreen() {
//   const cartItems = useCartStore((state) => state.cartItems);
//   const clearCart = useCartStore((state) => state.clearCart);
//   const { firstName, lastName, email, phone } = useAuthStore();
//   const [userData, setUserData] = useState<any>(null);
//   const [total, setTotal] = useState(0);

//   const fetchUserProfile = async () => {
//     try {
//       const { token } = useAuthStore.getState();

//       if (!token) {
//         throw new Error('No token found, please log in again.');
//       }

//       const response = await dealerProfile(token);
//       console.log('Dealer ID: ', response?.data?.dealer_id);
//       setUserData(response?.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     const sum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotal(sum);
//   }, [cartItems]);

//   const handlePayOnline = async () => {
//     try {
//       // Step 1: Create order API call to backend
//       const payload = {
//         dealer_id: userData?.dealer_id, // Ensure dealerId is passed correctly
//         cart: cartItems.map((item) => ({ product_id: item.id, quantity: item.quantity })), // Check cart mapping
//         payment_mode: 'ONLINE', // Ensure payment_mode is correctly set
//         total_amount: total, // Check total amount
//       };

//       // Log the payload to check if all fields are correct
//       console.log('Payload being sent to backend:', payload);

//       const orderResponse = await fetch('https://ariss-production.up.railway.app/api/order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await orderResponse.json();

//       if (!data.success) {
//         Alert.alert('Order Error', data.message || 'Failed to create order');
//         return;
//       }

//       // Step 2: Open Razorpay checkout
//       const { razorpayOrder } = data.order;

//       const options = {
//         description: 'Product purchase',
//         currency: 'INR',
//         key: 'rzp_test_KZdY3OFJg6ZWgg', // replace with your Razorpay key ID
//         amount: data.order.total_amount * 100, // in paise
//         name: `${firstName} ${lastName}`,
//         order_id: razorpayOrder.id,
//         prefill: { email, contact: phone, name: `${firstName} ${lastName}` },
//         theme: { color: '#F37254' },
//       };

//       RazorpayCheckout.open(options)
//         .then(async (paymentData) => {
//           console.log('Payment success:', paymentData);

//           // Step 3: Verify payment on backend after success
//           const verifyPayload = {
//             razorpay_order_id: paymentData.razorpay_order_id,
//             razorpay_payment_id: paymentData.razorpay_payment_id,
//             razorpay_signature: paymentData.razorpay_signature,
//           };

//           const verifyResponse = await fetch(
//             'https://ariss-production.up.railway.app/api/order/verify',
//             {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(verifyPayload),
//             }
//           );
//           const verifyData = await verifyResponse.json();

//           if (verifyData.success) {
//             Alert.alert('Payment Successful');
//             clearCart();
//             router.push('/'); // Navigate after successful payment
//           } else {
//             Alert.alert('Payment Verification Failed');
//           }
//         })
//         .catch((err) => {
//           console.error('Payment failed:', err);
//           Alert.alert('Payment Cancelled or Failed');
//         });
//     } catch (error) {
//       console.error('Payment Error:', error);
//       Alert.alert('Something went wrong');
//     }
//   };

//   return (
//     <View className="flex-1 bg-white p-4">
//       <Text className="mb-4 text-2xl font-bold">Cart</Text>
//       {cartItems.length === 0 ? (
//         <Text>Your cart is empty.</Text>
//       ) : (
//         <>
//           <FlatList
//             data={cartItems}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <View className="mb-2 flex-row justify-between">
//                 <Text>{item.name}</Text>
//                 <Text>
//                   ₹{item.price} x {item.quantity}
//                 </Text>
//               </View>
//             )}
//           />
//           <Text className="mt-4 text-lg font-bold">Total: ₹{total}</Text>

//           <TouchableOpacity className="mt-6 rounded-lg bg-black p-4" onPress={handlePayOnline}>
//             <Text className="text-center font-bold text-white">Pay Online</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="mt-4 rounded-lg bg-gray-400 p-4"
//             onPress={() => Alert.alert('Coming Soon')}>
//             <Text className="text-center font-bold text-white">Pay with Ledger</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

import { View, Text } from 'react-native';

const Cart = () => {
  return (
    <View>
      <Text>Cart</Text>
    </View>
  );
};

export default Cart;
