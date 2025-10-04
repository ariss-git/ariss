import Razorpay from 'razorpay';
import { config } from '../config/index.js';
// Instantiate razorpay client
export const razorpay = new Razorpay({
    key_id: config.razorpayKey,
    key_secret: config.razorpaySecret,
});
