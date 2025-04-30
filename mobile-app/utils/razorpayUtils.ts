// import RazorpayCheckout from 'react-native-razorpay';

// // Utility function for initiating Razorpay payment
// export const initiateRazorpayPayment = (amount: number, onSuccess: boolean, onFailure: boolean) => {
//   const options = {
//     description: 'Payment for your order',
//     image: 'https://your-logo-url.com/logo.png', // Optional logo
//     currency: 'INR',
//     key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay Key
//     amount: amount * 100, // Amount in paise
//     name: 'Your App Name',
//     prefill: {
//       email: 'user@example.com',
//       contact: '9999999999',
//     },
//     theme: { color: '#F37254' }, // Customize theme
//   };

//   try {
//     RazorpayCheckout.open(options)
//       .then((response) => {
//         onSuccess(response); // Handle success
//       })
//       .catch((error) => {
//         onFailure(error); // Handle failure
//       });
//   } catch (error) {
//     onFailure(error);
//   }
// };
