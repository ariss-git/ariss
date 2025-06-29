// src/services/product.service.ts
import { prisma } from '../db/prismaSingleton.js';
//Service to add product
export const addProductService = async (product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords, product_price, subcategory_name, category_name) => {
    const exisitingProduct = await prisma.product.findUnique({
        where: { product_title },
    });
    if (exisitingProduct)
        throw new Error(`${exisitingProduct.product_title} already exists`);
    const category = await prisma.category.findUnique({
        where: { category_name },
    });
    const subcategory = await prisma.subcategory.findUnique({
        where: { subcategory_name },
    });
    if (!category)
        throw new Error('Provided category is invalid or unavailable');
    if (!subcategory)
        throw new Error('Provided subcategory is invalid or unavailable');
    return await prisma.product.create({
        data: {
            product_title,
            product_sku,
            product_type,
            product_description,
            product_image,
            product_warranty,
            product_quantity,
            product_label,
            product_visibility,
            product_usps,
            product_keywords,
            product_price,
            category_id: category.category_id,
            subcategory_id: subcategory.subcategory_id,
        },
    });
};
// Service to fetch all products
export const getAllProductsService = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: {
                select: {
                    category_name: true,
                },
            },
            subcategory: {
                select: {
                    subcategory_name: true,
                },
            },
        },
    });
    return products;
};
// Service to fetch single products
export const getSingleProductService = async (product_id) => {
    // Fetch the details of a desired product
    const products = await prisma.product.findUnique({
        where: {
            product_id,
        },
        include: {
            category: {
                select: {
                    category_name: true,
                },
            },
            subcategory: {
                select: {
                    subcategory_name: true,
                },
            },
        },
    });
    if (!products)
        throw new Error('Request failed as the product is invalid'); // Throw if product doesn't exist
    return products;
};
// Service to fetch products by their categories
export const getAllProductsByCategoryService = async (category_id) => {
    if (!category_id)
        throw new Error('Category ID is required'); // Throw if category_id is not provided
    // Fetch all subcategories linked to this category
    const subcategory = await prisma.subcategory.findMany({
        where: {
            category_id,
        },
        select: {
            subcategory_id: true,
            subcategory_name: true,
            subcategory_image: true,
        },
    });
    // Fetch all products that belong to this category OR any subcategory within it
    const product = await prisma.product.findMany({
        where: {
            OR: [{ category_id }, { subcategory_id: { in: subcategory.map((sub) => sub.subcategory_id) } }],
        },
        include: {
            subcategory: true, // Include subcategory details
        },
    });
    return { subcategory, product };
};
// Service to fetch products by their subcategories
export const getAllProductsBySubcategoryService = async (subcategory_id) => {
    if (!subcategory_id)
        throw new Error('Subcategory ID is required'); // Throw if subcategory_id is not provided
    // Fetch all products that belong to this category OR any subcategory within it
    return await prisma.product.findMany({
        where: {
            subcategory_id,
        },
    });
};
// Service to update a product
export const updateProductService = async (product_id, product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords) => {
    // Check whether the product exists or not
    const exisitingProduct = await prisma.product.findUnique({
        where: { product_id },
    });
    if (!exisitingProduct)
        throw new Error(`Provided product-id is incorrect`); // Throw if product id is wrong
    // Update the selected product
    return await prisma.product.update({
        where: {
            product_id,
        },
        data: {
            product_title,
            product_sku,
            product_type,
            product_description,
            product_image,
            product_warranty,
            product_quantity,
            product_label,
            product_visibility,
            product_usps,
            product_keywords,
        },
    });
};
// Service to delete a product
export const deleteProductService = async (product_id) => {
    // Check whether the product exists or not
    const exisitingProduct = await prisma.product.findUnique({
        where: { product_id },
    });
    if (!exisitingProduct)
        throw new Error(`Provided product-id is incorrect`); // Throw if product id is wrong
    // Delete product
    return await prisma.product.delete({
        where: {
            product_id,
        },
    });
};
// Service to add subcategory for a category
export const addSubcategoryService = async (subcategory_name, subcategory_image, category_name) => {
    const exisitingSubcategory = await prisma.subcategory.findUnique({
        where: {
            subcategory_name,
        },
    });
    if (exisitingSubcategory)
        throw new Error('Subcategory already exist');
    const category = await prisma.category.findUnique({
        where: {
            category_name,
        },
    });
    if (!category)
        throw new Error('Provided category is invalid or unavailable');
    return await prisma.subcategory.create({
        data: {
            subcategory_name,
            subcategory_image,
            category_id: category.category_id,
        },
    });
};
// Service to fetch all subcategories
export const getAllSubcategoriesService = async () => {
    return await prisma.subcategory.findMany({
        select: {
            subcategory_id: true,
            subcategory_name: true,
            subcategory_image: true,
            category: {
                select: {
                    category_name: true,
                },
            },
        },
    });
};
// Service to fetch single subcategory
export const getSingleSubcategoryService = async (subcategory_id) => {
    const subcategory = await prisma.subcategory.findUnique({
        where: {
            subcategory_id,
        },
    });
    if (!subcategory)
        throw new Error('Invalid subcategory');
    return await prisma.subcategory.findMany({
        where: {
            subcategory_id,
        },
        select: {
            subcategory_id: true,
            subcategory_name: true,
            subcategory_image: true,
            category: {
                select: {
                    category_name: true,
                },
            },
        },
    });
};
// Service to update subcategory
export const updateSubcategoryService = async (subcategory_id, subcategory_name, subcategory_image) => {
    const subcategory = await prisma.subcategory.findUnique({
        where: {
            subcategory_id,
        },
    });
    if (!subcategory)
        throw new Error('Invalid subcategory');
    return await prisma.subcategory.update({
        where: {
            subcategory_id,
        },
        data: {
            subcategory_name,
            subcategory_image,
        },
    });
};
// Service to get all subcategory by their categories
export const getAllSubcategoriesUnderCategoryService = async (category_id) => {
    const subcategory = await prisma.subcategory.findMany({
        where: {
            category_id,
        },
        select: {
            subcategory_id: true,
            subcategory_name: true,
            subcategory_image: true,
        },
    });
    if (!subcategory)
        throw new Error('Subcategory do not exist in this category');
    return subcategory;
};
// Service to delete subcategory
export const deleteSubcategoryService = async (subcategory_id) => {
    const subcategory = await prisma.subcategory.findUnique({
        where: {
            subcategory_id,
        },
    });
    if (!subcategory?.subcategory_id)
        throw new Error('Invalid subcategory ID');
    return await prisma.subcategory.delete({
        where: {
            subcategory_id,
        },
    });
};
// Service to add category for products
export const addCategoryService = async (category_name, category_image) => {
    const exisitingCategory = await prisma.category.findUnique({
        where: {
            category_name,
        },
    });
    if (exisitingCategory)
        throw new Error('This category already exists');
    return await prisma.category.create({
        data: {
            category_name,
            category_image,
        },
    });
};
// Service to fetch all categories for product
export const getAllCategoriesService = async () => {
    return await prisma.category.findMany();
};
// Service to fetch all category names for product
export const getAllCategoryNameService = async () => {
    return await prisma.category.findMany({
        select: {
            category_id: true,
            category_name: true,
        },
    });
};
// Service to fetch single category for product
export const getSingleCategoryService = async (category_id) => {
    const category = await prisma.category.findUnique({
        where: {
            category_id,
        },
    });
    if (!category)
        throw new Error('Invalid Category');
    return category;
};
// Service to update a category
export const updateCategoryService = async (category_id, category_name, category_image) => {
    const category = await prisma.category.findUnique({
        where: {
            category_id,
        },
    });
    if (!category)
        throw new Error('Invalid Category');
    return await prisma.category.update({
        where: {
            category_id,
        },
        data: {
            category_name,
            category_image,
        },
    });
};
// Service to delete a category for product
export const deleteCategoryService = async (category_id) => {
    return await prisma.category.delete({
        where: {
            category_id,
        },
    });
};
