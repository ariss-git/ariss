import { config } from '@/config/index.js';
import twilio from 'twilio';
export const twilioWhatsappClient = async () => {
    return await twilio(config.twilioSID, config.twilioToken);
};
