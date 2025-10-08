import { config } from '@/config/index.js';
import nodemailer from 'nodemailer';

// Instantiate email transporter
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

export default emailTransporter;
