// src/services/dealer.service.ts
import { prisma } from '../db/prismaSingleton.js';
import { Prisma, UserType } from '@prisma/client';
import { validateGST } from '../lib/validateGST.js';
import { verifyOTP } from './otp.service.js';
import { waitforApprovalNotification } from '../lib/waitForApprovalNotification.js';
import { NotificationService } from './notification.service.js';
const notifications = new NotificationService();
/**
 * DealerService Class
 * ===================
 * This service layer handles all business logic related to dealer operations.
 * Responsibilities include:
 *  - Dealer registration (including OTP verification, GST validation)
 *  - Dealer login/profile verification
 *  - Preparing and storing billing/shipping addresses
 *  - Sending notifications for dealer approval
 * This layer interacts directly with the database through Prisma and is called
 * by controller methods to execute business logic.
 */
export class DealerService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    /**
     * ============================================
     *      REGISTER DEALER SERVICE
     * ============================================
     * @desc    Handles dealer account creation, GST validation, OTP verification,
     *          and triggers approval notification after successful registration
     * @param   phone - Dealer phone number
     * @param   email - Dealer email address
     * @param   first_name - Dealer first name
     * @param   last_name - Dealer last name
     * @param   gstin - Dealer GST Identification Number
     * @param   usertype - User role (validated against enum)
     * @param   shipping_address - Optional shipping address
     * @param   apiKey - GST API key for validation
     * @param   otp - OTP for authentication
     * @returns Newly created dealer record
     */
    async registerDealerService(phone, email, first_name, last_name, gstin, usertype, shipping_address, apiKey, otp) {
        try {
            console.log('Checking Existing Dealer...');
            // Check if dealer already exists with same phone or email
            const existingDealer = await this.prismaClient.dealers.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (existingDealer) {
                console.error('Dealer Already Exists');
                throw new Error('Dealer account already exists...');
            }
            console.log('OTP Verification for:', email);
            // Verify OTP before proceeding
            if (!(await verifyOTP(email, otp))) {
                console.error('Invalid OTP');
                throw new Error('Invalid or expired OTP');
            }
            console.log('Validating User Type...');
            // Ensure provided user type matches defined Prisma enum
            const userTypeEnum = usertype;
            if (!Object.values(UserType).includes(userTypeEnum)) {
                console.error(`Invalid User Type: ${usertype}`);
                throw new Error(`Invalid user type: ${usertype}`);
            }
            console.log('Fetching GSTIN Details...');
            // Validate GSTIN and fetch details from GST API
            const gstDetails = await validateGST(gstin, apiKey);
            if (!gstDetails) {
                console.error('GSTIN Validation Failed');
                throw new Error('Failed to fetch GST details');
            }
            console.log('GSTIN Valid:', gstDetails.tradeNam);
            const business_name = gstDetails.tradeNam || 'N/A';
            // Construct billing address from GST API response
            const billing_address = {
                pncd: gstDetails.pradr.addr?.pncd || '',
                st: gstDetails.pradr.addr?.st || '',
                dst: gstDetails.pradr.addr?.dst || '',
                loc: gstDetails.pradr.addr?.loc || '',
                stcd: gstDetails.pradr.addr?.stcd || '',
                adr: gstDetails.pradr.addr?.bnm || '',
            };
            console.log('Saving Dealer...');
            // Save dealer record into database
            const dealer = await this.prismaClient.dealers.create({
                data: {
                    phone,
                    email,
                    first_name,
                    last_name,
                    gstin,
                    usertype: userTypeEnum,
                    business_name,
                    billing_address,
                    shipping_address: shipping_address ? shipping_address : Prisma.JsonNull,
                },
            });
            console.log('Dealer Successfully Created:', dealer);
            console.log('Sending Approval Notification...');
            // Notify back office/admin for approval
            await waitforApprovalNotification(dealer.phone, dealer.first_name, dealer.last_name, dealer.email);
            notifications.createNotificationService({
                title: 'Dealer Registration',
                description: `${dealer.business_name} is waiting to be approved`,
            });
            return dealer;
        }
        catch (error) {
            console.error('Error in registerDealerService:', error);
            throw error; // Forward error to controller for handling
        }
    }
    /**
     * ============================================
     *      IS DEALER SIGNED-IN SERVICE
     * ============================================
     * @desc    Verifies dealer existence by ID and returns profile info
     * @param   dealer_id - Dealer unique identifier
     * @returns Dealer profile if found, null otherwise
     */
    async isDealerSignedIn(dealer_id) {
        return await prisma.dealers.findUnique({
            where: { dealer_id },
            select: {
                dealer_id: true,
                email: true,
                phone: true,
                first_name: true,
                last_name: true,
                business_name: true,
                gstin: true,
                billing_address: true,
                shipping_address: true,
                createdAt: true,
                usertype: true,
            },
        });
    }
}
