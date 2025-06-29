// src/lib/confirmRegister.ts
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
// Send registration confirmation message to technician
export const confirmRegisterTechnician = async (phone, first_name, last_name, email) => {
    try {
        // Instantiate twilio client
        const twilioClient = await twilio(config.twilioSID, config.twilioToken);
        if (!phone.startsWith('+')) {
            throw new Error('Invalid phone number format. Must be in E.164 format (e.g., +11234567890).');
        }
        const message = await twilioClient.messages.create({
            from: 'whatsapp:' + config.twilioNumber, // Your Twilio number
            to: 'whatsapp:' + phone, // Technician WhatsApp number
            body: `${first_name} ${last_name}, your technician account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
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
            text: `${first_name} ${last_name}, your technician account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
        });
        console.log('Approval message sent on Whatsapp: ', message.sid);
    }
    catch (error) {
        console.error('Failed to send whatsapp message', error.message); // Throw an error if delivering of message fails
    }
};
// Send registration confirmation message to back office
export const confirmRegisterBackOffice = async (phone, first_name, last_name, email) => {
    try {
        // Instantiate twilio client
        const twilioClient = await twilio(config.twilioSID, config.twilioToken);
        if (!phone.startsWith('+')) {
            throw new Error('Invalid phone number format. Must be in E.164 format (e.g., +11234567890).');
        }
        const message = await twilioClient.messages.create({
            from: 'whatsapp:' + config.twilioNumber, // Your Twilio number
            to: 'whatsapp:' + phone, // Back Office WhatsApp number
            body: `${first_name} ${last_name}, your back office account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
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
            text: `${first_name} ${last_name}, your back office account has been succesfully registered but is not approved yet. You can access our app once your account is approved.`,
        });
        console.log('Approval message sent on Whatsapp: ', message.sid);
    }
    catch (error) {
        console.error('Failed to send whatsapp message', error.message); // Throw an error if delivering of message fails
    }
};
