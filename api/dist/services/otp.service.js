// src/services/otp.service.ts
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import clientRedis from '../lib/redisClient.js';
import { config } from '../config/index.js';
const OTP_EXPIRATION = 300;
// Twilio Client Setup
const twilioClient = twilio(config.twilioSID, config.twilioToken);
// Generate a 6-digit OTP
export const generateOTP = () => crypto.randomInt(100000, 999999).toString();
// Send OTP via email
export const sendOTPEmail = async (email, otp) => {
    const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailUser,
            pass: config.emailPassword,
        },
    });
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
};
// Send OTP via WhatsApp using Twilio
export const sendOTPWhatsApp = async (phone, otp) => {
    try {
        const message = await twilioClient.messages.create({
            body: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
            from: `whatsapp:${config.twilioNumber}`,
            to: `whatsapp:${phone}`,
        });
        console.log('WhatsApp OTP sent:', message.sid);
        return true;
    }
    catch (error) {
        console.error('WhatsApp OTP failed:', error);
        return false;
    }
};
// Store OTP in Redis cache
export const storeOTP = async (email, otp) => {
    await clientRedis.setEx(`otp:${email}`, OTP_EXPIRATION, otp);
};
// Verify OTP
export const verifyOTP = async (email, otp) => {
    const storedOTP = await clientRedis.get(`otp:${email}`);
    if (!storedOTP || storedOTP !== otp)
        return false;
    await clientRedis.del(`otp:${email}`); // Remove OTP after successful verification
    return true;
};
