import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Get the current directory from the import.meta.url (equivalent to __dirname in ESM)
const __dirname = dirname(fileURLToPath(import.meta.url));
// Load environment variables from the .env file in the root folder
dotenv.config({ path: resolve(__dirname, '../../.env') });
export const config = {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtkey: process.env.JWT_SECRET || 'ariss-jwt-secret-key',
    gstApiKey: process.env.GST_API_KEY,
    twilioSID: process.env.TWILIO_ACCOUNT_SID,
    twilioToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASS,
    emailService: process.env.EMAIL_SERVICE,
    otpExpiry: process.env.OTP_EXPIRY,
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    whatsappApiUrl: process.env.WHATSAPP_API_URL,
    whatsappApiToken: process.env.WHATSAPP_API_TOKEN,
    razorpayKey: process.env.RAZORPAY_ID,
    razorpaySecret: process.env.RAZORPAY_SECRET,
};
