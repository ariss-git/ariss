// src/services/technician.service.ts
import { UserType } from '@prisma/client';
import { prisma } from '../db/prismaSingleton.js';
import { verifyOTP } from './otp.service.js';
import { confirmRegisterTechnician } from '../lib/confirmRegister.js';
import { NotificationService } from './notification.service.js';
const notification = new NotificationService();
/**
 * @class TechinianService
 * @desc  Contains all business logic for technician management including registration, approval, and retrieval.
 */
export class TechinianService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    /**
     * @desc    Registers a new technician after verifying OTP and dealer
     * @param   phone Technician phone number
     * @param   email Technician email
     * @param   first_name Technician first name
     * @param   last_name Technician last name
     * @param   usertype User type (must be TECHNICIAN)
     * @param   dealerId Associated dealer ID
     * @param   otp One-time password for verification
     * @returns Newly created technician record
     * @throws  Error if technician exists, OTP invalid, or dealer invalid
     */
    async registerTechinicianService(phone, email, first_name, last_name, usertype, dealerId, otp) {
        const existingTechnician = await this.prismaClient.technicians.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
        if (existingTechnician)
            throw new Error('Techinican account already exists');
        const userTypeEnum = usertype;
        if (!Object.values(UserType).includes(userTypeEnum)) {
            throw new Error(`Invalid user type: ${usertype}`);
        }
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id: dealerId },
        });
        if (!existingDealer)
            throw new Error('Dealer with this ID does not exist');
        if (!(await verifyOTP(email, otp)))
            throw new Error('Invalid or expired OTP');
        confirmRegisterTechnician(phone, first_name, last_name, email);
        const tech = await this.prismaClient.technicians.create({
            data: {
                phone,
                email,
                first_name,
                last_name,
                usertype: userTypeEnum,
                dealerid: dealerId,
            },
        });
        notification.createNotificationService({
            title: 'Technician Registration',
            description: `New technician ${tech.first_name} ${tech.last_name} is waiting for approval`,
        });
        return tech;
    }
    /**
     * @desc    Checks if a technician is logged in and fetches their profile details
     * @param   tech_id Technician ID
     * @returns Technician profile data or null if not found
     */
    async isTechnicianSignedIn(tech_id) {
        return await this.prismaClient.technicians.findUnique({
            where: { tech_id },
            select: {
                tech_id: true,
                phone: true,
                email: true,
                first_name: true,
                last_name: true,
                profile_pic: true,
                dealerid: true,
                createdAt: true,
                usertype: true,
                dealer: { select: { business_name: true, shipping_address: true } },
            },
        });
    }
    /**
     * @desc    Approves a technician for a dealer
     * @param   dealer_id Dealer ID
     * @param   tech_id Technician ID
     * @returns Updated technician record
     * @throws  Error if technician does not exist
     */
    async approveTechnicianService(dealer_id, tech_id) {
        const existingTechnician = await this.prismaClient.technicians.findUnique({
            where: { tech_id, dealerid: dealer_id },
        });
        if (!existingTechnician)
            throw new Error('Technician do not exist');
        const tech = await this.prismaClient.technicians.update({
            where: { tech_id },
            data: { isApproved: true },
        });
        notification.createNotificationService({
            title: 'Technician',
            description: `Technician ${tech.first_name} ${tech.last_name} has been approved`,
        });
        return tech;
    }
    /**
     * @desc    Retrieves all approved technicians for a specific dealer
     * @param   dealer_id Dealer ID
     * @returns List of approved technicians
     * @throws  Error if dealer not found
     */
    async getAllApprovedTechniciansService(dealer_id) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });
        if (!existingDealer)
            throw new Error('Dealer with this ID is not found');
        return await this.prismaClient.technicians.findMany({
            where: { isApproved: true },
        });
    }
    /**
     * @desc    Retrieves all disapproved technicians for a specific dealer
     * @param   dealer_id Dealer ID
     * @returns List of disapproved technicians
     * @throws  Error if dealer not found
     */
    async getAllDisapprovedTechniciansService(dealer_id) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });
        if (!existingDealer)
            throw new Error('Dealer with this ID is not found');
        return await this.prismaClient.technicians.findMany({
            where: { isApproved: false },
        });
    }
    /**
     * @desc    Disapproves a technician for a dealer
     * @param   dealer_id Dealer ID
     * @param   tech_id Technician ID
     * @returns Updated technician record
     * @throws  Error if technician does not exist
     */
    async disapproveTechnicianService(dealer_id, tech_id) {
        const existingTechnician = await this.prismaClient.technicians.findUnique({
            where: { tech_id, dealerid: dealer_id },
        });
        if (!existingTechnician)
            throw new Error('Technician do not exist');
        const tech = await this.prismaClient.technicians.update({
            where: { tech_id },
            data: { isApproved: false },
        });
        notification.createNotificationService({
            title: 'Technician',
            description: `Technician ${tech.first_name} ${tech.last_name} has been disapproved`,
        });
        return tech;
    }
    /**
     * @desc    Retrieves all technicians associated with a specific dealer
     * @param   dealer_id Dealer ID
     * @returns List of all technicians for the dealer
     */
    async getAllTechniciansForDealer(dealer_id) {
        return await this.prismaClient.technicians.findMany({
            where: { dealerid: dealer_id },
        });
    }
}
