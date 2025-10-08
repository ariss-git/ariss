// src/lib/waitForApprovalNotification.ts

import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import emailTransporter from './email-transporter.js';

export const waitforApprovalNotification = async (
    phone: string,
    first_name: string,
    last_name: string,
    email: string
) => {
    try {
        // Instantiate twilio client (without await)
        const twilioClient = twilio(config.twilioSID, config.twilioToken);

        // Debug: Log phone number
        console.log(`Sending WhatsApp message to: ${phone}`);

        if (!phone.startsWith('+')) {
            throw new Error('Invalid phone number format. Must be in E.164 format (e.g., +11234567890).');
        }

        const message = await twilioClient.messages.create({
            from: 'whatsapp:' + config.twilioNumber,
            to: 'whatsapp:' + phone,
            body: `Hello ${first_name} ${last_name}, your dealer account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
        });

        console.log('Approval message sent on WhatsApp:', message.sid);

        // Instantiate email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPassword, // Use App Password if needed
            },
        });

        await transporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'ARISS account approval status',
            text: `Hello ${first_name} ${last_name}, your dealer account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
        });

        console.log('Approval email sent to:', email);
    } catch (error: any) {
        console.error('Failed to send notification:', error.message);
    }
};

export const dealerWaitforApprovalEmail = async (fullname: string, email: string) => {
    try {
        await emailTransporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'ARISS account approval status',
            text: `Hello ${fullname}, your dealer account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
        });

        console.log('Approval email sent to:', email);
    } catch (error: any) {
        console.error('Failed to send notification:', error.message);
    }
};
