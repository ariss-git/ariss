// src/services/customer.service.ts
import { prisma } from '../db/prismaSingleton.js';
import { approveDealerOnWhatsapp } from '../lib/approveDealerOnWhatsapp.js';
/**
 * Customer Service Layer
 * ----------------------
 * Handles all business logic and database interactions related to:
 *  - Dealers
 *  - Technicians
 *  - Back Office Users
 *  - Customers (aggregate)
 *
 * Uses Prisma ORM for database access and external libraries for notifications.
 */
export class CustomerService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    /* =============================
       DEALERS
    ============================= */
    /**
     * Fetch all dealers who are approved.
     * @returns List of approved dealer records
     */
    async getAllApprovedCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isApproved: true },
        });
        if (!dealers)
            throw new Error('Failed fetching approved dealers');
        return dealers;
    }
    /**
     * Fetch a single dealer by dealer_id.
     * @param dealer_id - Unique dealer identifier
     * @returns Dealer record
     */
    async getSingleDealerService(dealer_id) {
        const dealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });
        if (!dealer)
            throw new Error('Dealer does not exist with that ID');
        return dealer;
    }
    /**
     * Fetch all dealers who are also distributors.
     * @returns List of distributor dealers
     */
    async getAllDistributorCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isDistributor: true },
        });
        if (!dealers)
            throw new Error('Failed fetching approved distributors');
        return dealers;
    }
    /**
     * Fetch all dealers who are not approved yet.
     * @returns List of unapproved dealers
     */
    async getAllNotApprovedCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isApproved: false },
        });
        if (!dealers)
            throw new Error('Failed fetching not approved dealers');
        return dealers;
    }
    /**
     * Approve a dealer by ID.
     * Also sends a WhatsApp + Email notification to the dealer.
     * @param dealer_id - Dealer identifier
     * @returns Updated dealer record
     */
    async approveDealerService(dealer_id) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isApproved: true },
        });
        await approveDealerOnWhatsapp(dealer.phone, dealer.first_name, dealer.last_name, dealer.email);
        if (!dealer)
            throw new Error("Dealer doesn't exist");
        return dealer;
    }
    /**
     * Disapprove a dealer by ID.
     * @param dealer_id - Dealer identifier
     * @returns Updated dealer record
     */
    async disapproveDealerService(dealer_id) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isApproved: false },
        });
        if (!dealer)
            throw new Error("Dealer doesn't exist");
        return dealer;
    }
    /**
     * Promote a dealer to distributor role.
     * @param dealer_id - Dealer identifier
     * @returns Updated dealer record with distributor flag
     */
    async updateToDistributorService(dealer_id) {
        const existingDealer = await this.prismaClient.dealers.findUnique({ where: { dealer_id } });
        if (!existingDealer)
            throw new Error('Invalid or Incorrect Dealer ID');
        return await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isDistributor: true },
        });
    }
    /**
     * Demote a distributor to regular dealer role.
     * @param dealer_id - Dealer identifier
     * @returns Updated dealer record with distributor flag removed
     */
    async updateDistributorToDealerService(dealer_id) {
        const existingDealer = await this.prismaClient.dealers.findUnique({ where: { dealer_id } });
        if (!existingDealer)
            throw new Error('Invalid or Incorrect Dealer ID');
        return await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isDistributor: false },
        });
    }
    /**
     * Update a dealer’s profile information.
     * @param dealer_id - Dealer identifier
     * @param first_name - Dealer's first name
     * @param last_name - Dealer's last name
     * @param profile_pic - Dealer's profile picture URL
     * @param isApproved - Dealer's approval status
     * @returns Updated dealer record
     */
    async updateDealerService(dealer_id, first_name, last_name, profile_pic, isApproved) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: {
                first_name,
                last_name,
                profile_pic,
                isApproved,
            },
        });
        if (!dealer.dealer_id)
            throw new Error('Dealer with this ID does not exist');
        return dealer;
    }
    /**
     * Permanently delete a dealer from the system.
     * @param dealer_id - Dealer identifier
     * @returns Deleted dealer record
     */
    async deleteDealerService(dealer_id) {
        const dealer = await this.prismaClient.dealers.delete({
            where: { dealer_id },
        });
        if (!dealer.dealer_id)
            throw new Error('Dealer with this ID does not exist');
        return dealer;
    }
    /* =============================
       TECHNICIANS
    ============================= */
    /**
     * Fetch all technicians along with their associated dealer details.
     * @returns List of technicians with dealer info
     */
    async getAllTechniciansService() {
        const technicians = await this.prismaClient.technicians.findMany({
            select: {
                tech_id: true,
                first_name: true,
                last_name: true,
                phone: true,
                email: true,
                isApproved: true,
                profile_pic: true,
                usertype: true,
                createdAt: true,
                isPassed: true,
                dealerid: true,
                dealer: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone: true,
                        gstin: true,
                        business_name: true,
                    },
                },
            },
        });
        if (!technicians)
            throw new Error('Failed fetching all the technicians');
        return technicians;
    }
    /**
     * Update a technician’s profile and test pass status.
     * @param tech_id - Technician identifier
     * @param first_name - Technician's first name
     * @param last_name - Technician's last name
     * @param profile_pic - Technician's profile picture URL
     * @param isPassed - Test pass status
     * @returns Updated technician record
     */
    async updateTechnicianService(tech_id, first_name, last_name, profile_pic, isPassed) {
        const technician = await this.prismaClient.technicians.update({
            where: { tech_id },
            data: {
                first_name,
                last_name,
                profile_pic,
                isPassed,
            },
        });
        if (!technician.tech_id)
            throw new Error('Technician with this ID does not exist');
        return technician;
    }
    /**
     * Permanently delete a technician from the system.
     * @param tech_id - Technician identifier
     * @returns Deleted technician record
     */
    async deleteTechnicianService(tech_id) {
        const technician = await this.prismaClient.technicians.delete({
            where: { tech_id },
        });
        if (!technician.tech_id)
            throw new Error('Technician with this ID does not exist');
        return technician;
    }
    /* =============================
       BACK OFFICE USERS
    ============================= */
    /**
     * Fetch all back office users along with their associated dealer details.
     * @returns List of back office users
     */
    async getAllBackOfficeService() {
        const backOffice = await this.prismaClient.backOffice.findMany({
            select: {
                backoffice_id: true,
                first_name: true,
                last_name: true,
                phone: true,
                email: true,
                isApproved: true,
                profile_pic: true,
                usertype: true,
                createdAt: true,
                dealerid: true,
                dealer: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone: true,
                        gstin: true,
                        business_name: true,
                    },
                },
            },
        });
        if (!backOffice)
            throw new Error('Failed fetching all the back office');
        return backOffice;
    }
    /**
     * Update a back office user’s profile information.
     * @param backoffice_id - Back office identifier
     * @param first_name - User's first name
     * @param last_name - User's last name
     * @param profile_pic - Profile picture URL
     * @returns Updated back office record
     */
    async updateBackOfficeService(backoffice_id, first_name, last_name, profile_pic) {
        const backOffice = await this.prismaClient.backOffice.update({
            where: { backoffice_id },
            data: {
                first_name,
                last_name,
                profile_pic,
            },
        });
        if (!backOffice.backoffice_id)
            throw new Error('Back Office with this ID does not exist');
        return backOffice;
    }
    /**
     * Permanently delete a back office user from the system.
     * @param backoffice_id - Back office identifier
     * @returns Deleted back office record
     */
    async deleteBackOfficeService(backoffice_id) {
        const backOffice = await this.prismaClient.backOffice.delete({
            where: { backoffice_id },
        });
        if (!backOffice.backoffice_id)
            throw new Error('Back Office with this ID does not exist');
        return backOffice;
    }
    /* =============================
       CUSTOMERS (AGGREGATE VIEW)
    ============================= */
    /**
     * Fetch all types of customers:
     *  - Dealers
     *  - Technicians
     *  - Back Office users
     *
     * @returns Aggregated object containing all customer types
     */
    async fetchAllCustomersService() {
        const dealers = await this.prismaClient.dealers.findMany({
            select: {
                dealer_id: true,
                first_name: true,
                last_name: true,
                business_name: true,
                email: true,
                phone: true,
                gstin: true,
                isApproved: true,
                isDistributor: true,
                usertype: true,
                createdAt: true,
            },
        });
        const techs = await this.prismaClient.technicians.findMany({
            select: {
                tech_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                isApproved: true,
                usertype: true,
                createdAt: true,
                dealer: {
                    select: {
                        business_name: true,
                    },
                },
            },
        });
        const backoffices = await this.prismaClient.backOffice.findMany({
            select: {
                backoffice_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                isApproved: true,
                usertype: true,
                createdAt: true,
                dealer: {
                    select: {
                        business_name: true,
                    },
                },
            },
        });
        return { dealers, techs, backoffices };
    }
}
