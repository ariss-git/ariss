// src/services/discount.service.ts
import { couponCodeNotify } from '../lib/couponCodeNotify.js';
import { prisma } from '../db/prismaSingleton.js';
import { DiscountType } from '@prisma/client';
/**
 * This service layer handles all business logic related to discount management.
 * It interacts with the database to assign discounts, fetch discounts, delete expired
 * discounts, and notify dealers. Controllers call these methods to perform operations
 * without handling database logic directly.
 */
export class DiscountService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    /**
     * @desc      Assign a discount to a dealer for a specific product
     * @param     dealer_id  string - ID of the dealer
     * @param     product_id string - ID of the product
     * @param     discount_type string - Type of discount (AMOUNT/PERCENTAGE)
     * @param     expiry_date string - Expiry date of the discount
     * @param     amount number | null - Discount amount (if type is AMOUNT)
     * @param     percentage number | null - Discount percentage (if type is PERCENTAGE)
     * @returns   Promise of the created discount record
     */
    async assignDiscountService(dealer_id, product_id, discount_type, expiry_date, amount, percentage) {
        const dealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
            select: { first_name: true, last_name: true, email: true, phone: true },
        });
        if (!dealer)
            throw new Error('Dealer does not exist');
        const product = await this.prismaClient.product.findUnique({
            where: { product_id },
            select: { product_title: true },
        });
        if (!product)
            throw new Error('Product does not exist');
        const coupon_code = `ARS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const formattedExpiryDate = new Date(`${expiry_date}T00:00:00.000Z`);
        const discountTypeEnum = discount_type.toUpperCase();
        if (!DiscountType[discountTypeEnum])
            throw new Error('Invalid discount type');
        const dealerName = `${dealer.first_name} ${dealer.last_name}`;
        await couponCodeNotify(dealer.phone, dealer.email, dealerName, product.product_title, coupon_code);
        return await this.prismaClient.discount.create({
            data: {
                dealer_id,
                product_id,
                discount_type: discountTypeEnum,
                expiry_date: formattedExpiryDate,
                coupon_code,
                amount,
                percentage,
            },
        });
    }
    /**
     * @desc      Fetch all discounts from the system
     * @returns   Promise of an array of all discount records
     */
    async getAllDiscountsService() {
        return await this.prismaClient.discount.findMany({
            include: {
                dealer: true,
                Product: true,
            },
        });
    }
    /**
     * @desc      Delete a single discount by ID
     * @param     discount_id string - ID of the discount
     * @returns   Promise of the deleted discount record
     */
    async getSingleDiscount(discount_id) {
        const existingDiscount = await this.prismaClient.discount.findUnique({
            where: { discount_id },
        });
        if (!existingDiscount)
            throw new Error('Discount ID not found');
        return await this.prismaClient.discount.delete({
            where: { discount_id },
        });
    }
    /**
     * @desc      Delete all expired discount coupons
     * @returns   Promise of the result of deleteMany operation
     */
    async deleteExpiredDiscountsService() {
        const now = new Date();
        return await this.prismaClient.discount.deleteMany({
            where: { expiry_date: { lt: now } },
        });
    }
    /**
     * @desc      Fetch all discounts assigned to a specific dealer
     * @param     dealer_id string - ID of the dealer
     * @returns   Promise of an array of discounts for that dealer
     */
    async getAllDiscountsForDealerService(dealer_id) {
        const discounts = await this.prismaClient.discount.findMany({
            where: { dealer_id },
            select: {
                coupon_code: true,
                expiry_date: true,
                percentage: true,
                amount: true,
                isActive: true,
                dealer_id: true,
                product_id: true,
                dealer: { select: { business_name: true } },
                Product: { select: { product_title: true } },
            },
        });
        if (!discounts)
            throw new Error('Cannot find discount for the dealer');
        return discounts;
    }
}
