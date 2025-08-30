// src/services/customer.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { approveDealerOnWhatsapp } from '../lib/approveDealerOnWhatsapp.js';

export class CustomerService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    /* =============================
   Dealers
============================= */

    // Fetch all approved dealers
    async getAllApprovedCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isApproved: true },
        });

        if (!dealers) throw new Error('Failed fetching approved dealers');
        return dealers;
    }

    // Fetch single dealer
    async getSingleDealerService(dealer_id: string) {
        const dealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });

        if (!dealer) throw new Error('Dealer does not exist with that ID');

        return dealer;
    }

    // Fetch all approved dealers who are also distributors
    async getAllDistributorCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isDistributor: true },
        });

        if (!dealers) throw new Error('Failed fetching approved distributors');
        return dealers;
    }

    // Fetch all dealers who are still waiting for approval
    async getAllNotApprovedCustomerService() {
        const dealers = await this.prismaClient.dealers.findMany({
            where: { isApproved: false },
        });

        if (!dealers) throw new Error('Failed fetching not approved dealers');
        return dealers;
    }

    // Approve a dealer by ID and send them a WhatsApp + Email notification
    async approveDealerService(dealer_id: string) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isApproved: true },
        });

        await approveDealerOnWhatsapp(dealer.phone, dealer.first_name, dealer.last_name, dealer.email);

        if (!dealer) throw new Error("Dealer doesn't exist");
        return dealer;
    }

    // Disapprove a dealer by ID
    async disapproveDealerService(dealer_id: string) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isApproved: false },
        });

        if (!dealer) throw new Error("Dealer doesn't exist");
        return dealer;
    }

    // Assign a dealer to distributor status
    async updateToDistributorService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({ where: { dealer_id } });

        if (!existingDealer) throw new Error('Invalid or Incorrect Dealer ID');

        return await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isDistributor: true },
        });
    }

    // Assign a distributor to dealer status
    async updateDistributorToDealerService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({ where: { dealer_id } });

        if (!existingDealer) throw new Error('Invalid or Incorrect Dealer ID');

        return await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: { isDistributor: false },
        });
    }

    // Update a dealer’s profile details
    async updateDealerService(
        dealer_id: string,
        first_name: string,
        last_name: string,
        profile_pic: string,
        isApproved: boolean
    ) {
        const dealer = await this.prismaClient.dealers.update({
            where: { dealer_id },
            data: {
                first_name,
                last_name,
                profile_pic,
                isApproved,
            },
        });

        if (!dealer.dealer_id) throw new Error('Dealer with this ID does not exist');
        return dealer;
    }

    // Remove a dealer from the system
    async deleteDealerService(dealer_id: string) {
        const dealer = await this.prismaClient.dealers.delete({
            where: { dealer_id },
        });

        if (!dealer.dealer_id) throw new Error('Dealer with this ID does not exist');
        return dealer;
    }

    /* =============================
   Technicians
============================= */

    // Fetch all technicians
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

        if (!technicians) throw new Error('Failed fetching all the technicians');
        return technicians;
    }

    // Update a technician’s profile details and pass status
    async updateTechnicianService(
        tech_id: string,
        first_name: string,
        last_name: string,
        profile_pic: string,
        isPassed: boolean
    ) {
        const technician = await this.prismaClient.technicians.update({
            where: { tech_id },
            data: {
                first_name,
                last_name,
                profile_pic,
                isPassed,
            },
        });

        if (!technician.tech_id) throw new Error('Technician with this ID does not exist');
        return technician;
    }

    // Remove a technician from the system
    async deleteTechnicianService(tech_id: string) {
        const technician = await this.prismaClient.technicians.delete({
            where: { tech_id },
        });

        if (!technician.tech_id) throw new Error('Technician with this ID does not exist');
        return technician;
    }

    /* =============================
   Back Office
============================= */

    // Fetch all back office users
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

        if (!backOffice) throw new Error('Failed fetching all the back office');
        return backOffice;
    }

    // Update a back office user’s profile details
    async updateBackOfficeService(
        backoffice_id: string,
        first_name: string,
        last_name: string,
        profile_pic: string
    ) {
        const backOffice = await this.prismaClient.backOffice.update({
            where: { backoffice_id },
            data: {
                first_name,
                last_name,
                profile_pic,
            },
        });

        if (!backOffice.backoffice_id) throw new Error('Back Office with this ID does not exist');
        return backOffice;
    }

    // Remove a back office user from the system
    async deleteBackOfficeService(backoffice_id: string) {
        const backOffice = await this.prismaClient.backOffice.delete({
            where: { backoffice_id },
        });

        if (!backOffice.backoffice_id) throw new Error('Back Office with this ID does not exist');
        return backOffice;
    }

    /**
     * =========================
     *       CUSTOMERS
     * =========================
     */

    // Fetch all sorts of customers
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
