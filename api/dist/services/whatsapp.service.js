// src/services/whatsappService.ts
import axios from 'axios';
import { config } from '../config/index.js';
export const sendWhatsAppOTP = async (phone, otp) => {
    try {
        const response = await axios.post(config.whatsappApiUrl, {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
                body: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
            },
        }, {
            headers: {
                Authorization: `Bearer ${config.whatsappApiToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('WhatsApp OTP sent:', response.data);
        return true;
    }
    catch (error) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        return false;
    }
};
