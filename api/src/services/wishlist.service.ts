// src/services/wishlist.service.ts

import { prisma } from '../db/prismaSingleton.js';

// Service to add product to wishlist
export const addToWishlistService = async (dealer_id: string, product_id: string) => {
    // Check if wishlist already exists
    const existingWishlist = await prisma.wishlist.findUnique({
        where: {
            dealer_id,
        },
    });

    if (existingWishlist) throw new Error('Dealer has already added this to wish list'); // Throw error

    // Assign wishlist to a user over a product
    return await prisma.wishlist.create({
        data: {
            dealer_id,
            product_id,
            isMarked: true,
        },
    });
};

// Service to fetch wishlisted product
export const getWishlistProductService = async (dealer_id: string, product_id: string) => {
    const wishlistEntry = await prisma.wishlist.findFirst({
        where: {
            dealer_id,
            product_id,
        },
        select: {
            product: {
                // Fetch product details
                select: {
                    product_title: true,
                    product_image: true,
                    product_price: true,
                },
            },
        },
    });

    if (!wishlistEntry) throw new Error('Wishlist entry not found');

    return wishlistEntry.product; // Return product details
};

// Service to delete wishlist
export const deleteWishlistService = async (wishlist_id: string) => {
    // Delete wishlist
    return await prisma.wishlist.delete({
        where: {
            wishlist_id,
        },
    });
};

// Service to fetch all wishlists
export const fetchAllWishlistsService = async () => {
    return await prisma.wishlist.findMany();
};
