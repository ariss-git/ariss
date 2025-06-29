// src/services/discount.service.ts
import { couponCodeNotify } from '../lib/couponCodeNotify.js';
import { prisma } from '../db/prismaSingleton.js';
import { DiscountType } from '@prisma/client';
export const assignDiscountService = async (dealer_id, product_id, discount_type, expiry_date, // changed to string since you're sending it from the controller
amount, // amount can now be null
percentage // percentage can now be null
) => {
    // Get dealer information
    const dealer = await prisma.dealers.findUnique({
        where: { dealer_id },
        select: { first_name: true, last_name: true, email: true, phone: true },
    });
    if (!dealer)
        throw new Error('Dealer does not exist'); // Throw if dealer is invalid
    // Get product name
    const product = await prisma.product.findUnique({
        where: { product_id },
        select: { product_title: true },
    });
    if (!product)
        throw new Error('Product does not exist'); // Throw if product is invalid
    // Generate unique Coupon code
    const coupon_code = `ARS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    // Ensure the expiry date is properly formatted
    const formattedExpiryDate = new Date(`${expiry_date}T00:00:00.000Z`);
    // Convert discount type to Enum
    const discountTypeEnum = discount_type.toUpperCase();
    if (!DiscountType[discountTypeEnum])
        throw new Error('Invalid discount type');
    // Full name of dealer
    const dealerName = `${dealer.first_name} ${dealer.last_name}`;
    // Notify dealer on mail and WhatsApp
    await couponCodeNotify(dealer.phone, dealer.email, dealerName, product.product_title, coupon_code);
    // Create discount for the dealer
    return await prisma.discount.create({
        data: {
            dealer_id,
            product_id,
            discount_type: discountTypeEnum,
            expiry_date: formattedExpiryDate,
            coupon_code,
            amount, // Could be null
            percentage, // Could be null
        },
    });
};
// Service to fetch all discount
export const getAllDiscountsService = async () => {
    return await prisma.discount.findMany();
};
// Service to delete single discount
export const getSingleDiscount = async (discount_id) => {
    const existingDiscount = await prisma.discount.findUnique({
        where: {
            discount_id,
        },
    });
    if (!existingDiscount)
        throw new Error('Discount ID not found');
    return await prisma.discount.delete({
        where: {
            discount_id,
        },
    });
};
// Service to delete expired discount coupons
export const deleteExpiredDiscountsService = async () => {
    // Current time
    const now = new Date();
    // Expire coupon when validity ends
    return await prisma.discount.deleteMany({
        where: { expiry_date: { lt: now } },
    });
};
// Service to get all discounts for a dealer
export const getAllDiscountsForDealerService = async (dealer_id) => {
    const discounts = await prisma.discount.findMany({
        where: {
            dealer_id,
        },
        select: {
            coupon_code: true,
            expiry_date: true,
            percentage: true,
            amount: true,
            isActive: true,
            dealer_id: true,
            product_id: true,
            dealer: {
                select: {
                    business_name: true,
                },
            },
            Product: {
                select: {
                    product_title: true,
                },
            },
        },
    });
    if (!discounts)
        throw new Error('Cannot find discount for the dealer');
    return discounts;
};
