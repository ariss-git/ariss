// src/lib/rmaNotifications/rmaReceived.ts

import { config } from '../../config/index.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Function to send coupon code on whatsapp and email
export const rmaReceived = async (phone: string, email: string, product_title: string) => {
    const twilioClient = twilio(config.twilioSID, config.twilioToken);
    const twilioNumber = config.twilioNumber;

    // Email Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailUser,
            pass: config.emailPassword,
        },
    });

    try {
        const message = `RMA request for ${product_title} has been sent to ARISS HQ. You will be notified once it is accepted.`;

        // Notify through Whatsapp
        await twilioClient.messages.create({
            from: `whatsapp:${twilioNumber}`,
            to: `whatsapp:${phone}`,
            body: message,
        });

        // Notify through Whatsapp
        await transporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'You have received a Discount Coupon!',
            text: message,
        });

        console.log('Notified on email and whatsapp');
    } catch (error) {
        console.error('Notification error: ', error);
    }
};
