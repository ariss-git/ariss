// src/controllers/wishlist.controller.ts
import { addToWishlistService, deleteWishlistService, fetchAllWishlistsService, getWishlistProductService, } from '../services/wishlist.service.js';
// Controller to assign wishlist to a product for a dealer
export const addToWishlistController = async (req, res) => {
    try {
        const { dealer_id, product_id } = req.body;
        if (!dealer_id || !product_id) {
            return res.status(404).json({ success: false, message: 'Dealer and Product ID are required' });
        }
        const wishlist = await addToWishlistService(dealer_id, product_id);
        return res.status(201).json({ success: true, data: wishlist });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to fetch details of the wishlisted product
export const getWishlistProductController = async (req, res) => {
    try {
        const { dealer_id, product_id } = req.params;
        if (!dealer_id || !product_id) {
            return res.status(404).json({ success: false, message: 'Dealer and Product ID are required' });
        }
        const wishlist = await getWishlistProductService(dealer_id, product_id);
        return res.status(200).json({ success: true, data: wishlist });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to delete a wishlist
export const deleteWishlistController = async (req, res) => {
    try {
        const { wishlist_id } = req.params;
        if (!wishlist_id) {
            return res.status(404).json({ success: false, message: 'Wishlist ID are required' });
        }
        const wishlist = await deleteWishlistService(wishlist_id);
        return res.status(200).json({ success: true, data: `${wishlist.wishlist_id} deleted` });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to fetch all wishlists
export const fetchAllWishlistsController = async (_req, res) => {
    try {
        const wishlists = await fetchAllWishlistsService();
        return res.status(200).json({ success: true, total: wishlists.length, data: wishlists });
        return;
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
