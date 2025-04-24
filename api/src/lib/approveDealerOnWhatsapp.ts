// src/lib/approveDealerOnWhatsapp.ts

import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

export const approveDealerOnWhatsapp = async (
    phone: string,
    first_name: string,
    last_name: string,
    email: string
) => {
    try {
        // Instantiate twilio client
        const twilioClient = await twilio(config.twilioSID, config.twilioToken);

        if (!phone.startsWith('+')) {
            throw new Error('Invalid phone number format. Must be in E.164 format (e.g., +11234567890).');
        }

        const message = await twilioClient.messages.create({
            from: 'whatsapp:' + config.twilioNumber, // Your Twilio number
            to: 'whatsapp:' + phone, // Dealer's WhatsApp number
            body: `Congratulations ${first_name} ${last_name}, your dealer account has been approved! 🎉 You can now access all dealer benefits in our app.`,
        });

        // Instantiate email transported
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            },
        });

        await transporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'ARISS account approval status',
            text: `Congratulations ${first_name} ${last_name}, your dealer account has been approved! 🎉 You can now access all dealer benefits in our app.`,
        });

        console.log('Approval message sent on Whatsapp: ', message.sid);
    } catch (error: any) {
        console.error('Failed to send whatsapp message', error.message); // Throw an error if delivering of message fails
    }
};
