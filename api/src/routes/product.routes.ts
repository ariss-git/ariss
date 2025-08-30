// src/routes/product.routes.ts

import * as productControllers from '../controllers/product.controller.js';
import { Router } from 'express';

const productRoutes = Router();

// =============================
// Category Routes
// =============================

// Create a new category
productRoutes.post('/category', productControllers.addCategoryController);

// Fetch all categories
productRoutes.get('/category', productControllers.getAllCategoriesController);

// Fetch only category names
productRoutes.get('/category/names', productControllers.getAllCategoryNameController);

// Fetch single category by ID
productRoutes.get('/category/:category_id', productControllers.getSingleCategoryController);

// Update category by ID
productRoutes.put('/category/:category_id', productControllers.updateCategoryController);

// Delete category by ID
productRoutes.delete('/category/:category_id', productControllers.deleteCategoryController);

// =============================
// Subcategory Routes
// =============================

// Create a new subcategory
productRoutes.post('/category/sub', productControllers.addSubcategoryController);

// Fetch all subcategories
productRoutes.get('/category/sub/all', productControllers.getAllSubcategoriesController);

// Fetch single subcategory by ID
productRoutes.get('/category/sub/:subcategory_id', productControllers.getSingleSubcategoryController);

// Fetch all subcategories under a specific category
productRoutes.get(
    '/category/sub/filter/:category_id',
    productControllers.getAllSubcategoriesUnderCategoryController
);

// Update subcategory by ID
productRoutes.put('/category/sub/:subcategory_id', productControllers.updateSubcategoryController);

// Delete subcategory by category ID
productRoutes.delete('/category/sub/:category_id', productControllers.deleteSubcategoryController);

// =============================
// Product Routes
// =============================

// Create a new product
productRoutes.post('/', productControllers.addProductController);

// Fetch all products
productRoutes.get('/', productControllers.getAllProductsController);

// Fetch single product by ID
productRoutes.get('/:product_id', productControllers.getSingleProductController);

// Fetch products by category ID
productRoutes.get('/cat-pro/:category_id', productControllers.getProductsByCategoryController);

// Fetch products by subcategory ID
productRoutes.get('/sub-pro/:subcategory_id', productControllers.getProductsBySubcategoryController);

// Update product by ID
productRoutes.put('/:product_id', productControllers.updateProductController);

// Delete product by ID
productRoutes.delete('/:product_id', productControllers.deleteProductController);

export default productRoutes;
