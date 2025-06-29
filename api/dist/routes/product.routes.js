// src/routes/product.routes.ts
import { addCategoryController, addProductController, addSubcategoryController, deleteCategoryController, deleteProductController, deleteSubcategoryController, getAllCategoriesController, getAllCategoryNameController, getAllProductsController, getAllSubcategoriesController, getAllSubcategoriesUnderCategoryController, getProductsByCategoryController, getProductsBySubcategoryController, getSingleCategoryController, getSingleProductController, getSingleSubcategoryController, updateCategoryController, updateProductController, updateSubcategoryController, } from '../controllers/product.controller.js';
import { Router } from 'express';
const productRoutes = Router();
// Category routes
productRoutes.post('/category', addCategoryController);
productRoutes.get('/category', getAllCategoriesController);
productRoutes.get('/category/names', getAllCategoryNameController);
productRoutes.get('/category/:category_id', getSingleCategoryController);
productRoutes.put('/category/:category_id', updateCategoryController);
productRoutes.delete('/category/:category_id', deleteCategoryController);
//Subcategory routes
productRoutes.post('/category/sub', addSubcategoryController);
productRoutes.get('/category/sub/all', getAllSubcategoriesController);
productRoutes.get('/category/sub/:subcategory_id', getSingleSubcategoryController);
productRoutes.get('/category/sub/filter/:category_id', getAllSubcategoriesUnderCategoryController);
productRoutes.put('/category/sub/:subcategory_id', updateSubcategoryController);
productRoutes.delete('/category/sub/:category_id', deleteSubcategoryController);
// Product routes
productRoutes.post('/', addProductController);
productRoutes.get('/', getAllProductsController);
productRoutes.get('/:product_id', getSingleProductController);
productRoutes.get('/cat-pro/:category_id', getProductsByCategoryController);
productRoutes.get('/sub-pro/:subcategory_id', getProductsBySubcategoryController);
productRoutes.put('/:product_id', updateProductController);
productRoutes.delete('/:product_id', deleteProductController);
export default productRoutes;
