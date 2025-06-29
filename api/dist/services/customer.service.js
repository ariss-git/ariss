// src/services/customer.service.ts
import { prisma } from '../db/prismaSingleton.js';
import { approveDealerOnWhatsapp } from '../lib/approveDealerOnWhatsapp.js';
/* =============================
   Dealers
============================= */
// Fetch all approved dealers
export const getAllApprovedCustomerService = async () => {
    const dealers = await prisma.dealers.findMany({
        where: { isApproved: true },
    });
    if (!dealers)
        throw new Error('Failed fetching approved dealers');
    return dealers;
};
// Fetch single dealer
export const getSingleDealerService = async (dealer_id) => {
    const dealer = await prisma.dealers.findUnique({
        where: { dealer_id },
    });
    if (!dealer)
        throw new Error('Dealer does not exist with that ID');
    return dealer;
};
// Fetch all approved dealers who are also distributors
export const getAllDistributorCustomerService = async () => {
    const dealers = await prisma.dealers.findMany({
        where: { isDistributor: true },
    });
    if (!dealers)
        throw new Error('Failed fetching approved distributors');
    return dealers;
};
// Fetch all dealers who are still waiting for approval
export const getAllNotApprovedCustomerService = async () => {
    const dealers = await prisma.dealers.findMany({
        where: { isApproved: false },
    });
    if (!dealers)
        throw new Error('Failed fetching not approved dealers');
    return dealers;
};
// Approve a dealer by ID and send them a WhatsApp + Email notification
export const approveDealerService = async (dealer_id) => {
    const dealer = await prisma.dealers.update({
        where: { dealer_id },
        data: { isApproved: true },
    });
    await approveDealerOnWhatsapp(dealer.phone, dealer.first_name, dealer.last_name, dealer.email);
    if (!dealer)
        throw new Error("Dealer doesn't exist");
    return dealer;
};
// Disapprove a dealer by ID
export const disapproveDealerService = async (dealer_id) => {
    const dealer = await prisma.dealers.update({
        where: { dealer_id },
        data: { isApproved: false },
    });
    if (!dealer)
        throw new Error("Dealer doesn't exist");
    return dealer;
};
// Assign a dealer to distributor status
export const updateToDistributorService = async (dealer_id) => {
    const existingDealer = await prisma.dealers.findUnique({ where: { dealer_id } });
    if (!existingDealer)
        throw new Error('Invalid or Incorrect Dealer ID');
    return await prisma.dealers.update({
        where: { dealer_id },
        data: { isDistributor: true },
    });
};
// Assign a distributor to dealer status
export const updateDistributorToDealerService = async (dealer_id) => {
    const existingDealer = await prisma.dealers.findUnique({ where: { dealer_id } });
    if (!existingDealer)
        throw new Error('Invalid or Incorrect Dealer ID');
    return await prisma.dealers.update({
        where: { dealer_id },
        data: { isDistributor: false },
    });
};
// Update a dealer’s profile details
export const updateDealerService = async (dealer_id, first_name, last_name, profile_pic, isApproved) => {
    const dealer = await prisma.dealers.update({
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
};
// Remove a dealer from the system
export const deleteDealerService = async (dealer_id) => {
    const dealer = await prisma.dealers.delete({
        where: { dealer_id },
    });
    if (!dealer.dealer_id)
        throw new Error('Dealer with this ID does not exist');
    return dealer;
};
/* =============================
   Technicians
============================= */
// Fetch all technicians
export const getAllTechniciansService = async () => {
    const technicians = await prisma.technicians.findMany({
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
};
// Update a technician’s profile details and pass status
export const updateTechnicianService = async (tech_id, first_name, last_name, profile_pic, isPassed) => {
    const technician = await prisma.technicians.update({
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
};
// Remove a technician from the system
export const deleteTechnicianService = async (tech_id) => {
    const technician = await prisma.technicians.delete({
        where: { tech_id },
    });
    if (!technician.tech_id)
        throw new Error('Technician with this ID does not exist');
    return technician;
};
/* =============================
   Back Office
============================= */
// Fetch all back office users
export const getAllBackOfficeService = async () => {
    const backOffice = await prisma.backOffice.findMany({
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
};
// Update a back office user’s profile details
export const updateBackOfficeService = async (backoffice_id, first_name, last_name, profile_pic) => {
    const backOffice = await prisma.backOffice.update({
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
};
// Remove a back office user from the system
export const deleteBackOfficeService = async (backoffice_id) => {
    const backOffice = await prisma.backOffice.delete({
        where: { backoffice_id },
    });
    if (!backOffice.backoffice_id)
        throw new Error('Back Office with this ID does not exist');
    return backOffice;
};
/**
 * =========================
 *       CUSTOMERS
 * =========================
 */
// Fetch all sorts of customers
export const fetchAllCustomersService = async () => {
    const dealers = await prisma.dealers.findMany({
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
    const techs = await prisma.technicians.findMany({
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
    const backoffices = await prisma.backOffice.findMany({
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
};
