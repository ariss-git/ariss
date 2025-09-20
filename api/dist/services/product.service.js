// src/services/product.service.ts
import { prisma } from '../db/prismaSingleton.js';
import { NotificationService } from './notification.service.js';
const notification = new NotificationService();
export class ProductService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    //Service to add product
    async addProductService(product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords, product_price, subcategory_name, category_name) {
        const exisitingProduct = await this.prismaClient.product.findUnique({
            where: { product_title },
        });
        if (exisitingProduct)
            throw new Error(`${exisitingProduct.product_title} already exists`);
        const category = await this.prismaClient.category.findUnique({
            where: { category_name },
        });
        const subcategory = await this.prismaClient.subcategory.findUnique({
            where: { subcategory_name },
        });
        if (!category)
            throw new Error('Provided category is invalid or unavailable');
        if (!subcategory)
            throw new Error('Provided subcategory is invalid or unavailable');
        const product = await this.prismaClient.product.create({
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
        const payload = {
            title: 'Product',
            description: `New ${product_title} has been added`,
        };
        notification.createNotificationService(payload);
        return product;
    }
    // Service to fetch all products
    async getAllProductsService() {
        const products = await this.prismaClient.product.findMany({
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
    }
    // Service to fetch single products
    async getSingleProductService(product_id) {
        // Fetch the details of a desired product
        const products = await this.prismaClient.product.findUnique({
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
    }
    // Service to fetch products by their categories
    async getAllProductsByCategoryService(category_id) {
        if (!category_id)
            throw new Error('Category ID is required'); // Throw if category_id is not provided
        // Fetch all subcategories linked to this category
        const subcategory = await this.prismaClient.subcategory.findMany({
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
        const product = await this.prismaClient.product.findMany({
            where: {
                OR: [
                    { category_id },
                    { subcategory_id: { in: subcategory.map((sub) => sub.subcategory_id) } },
                ],
            },
            include: {
                subcategory: true, // Include subcategory details
            },
        });
        return { subcategory, product };
    }
    // Service to fetch products by their subcategories
    async getAllProductsBySubcategoryService(subcategory_id) {
        if (!subcategory_id)
            throw new Error('Subcategory ID is required'); // Throw if subcategory_id is not provided
        // Fetch all products that belong to this category OR any subcategory within it
        return await this.prismaClient.product.findMany({
            where: {
                subcategory_id,
            },
        });
    }
    // Service to update a product
    async updateProductService(product_id, product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords) {
        // Check whether the product exists or not
        const exisitingProduct = await this.prismaClient.product.findUnique({
            where: { product_id },
        });
        if (!exisitingProduct)
            throw new Error(`Provided product-id is incorrect`); // Throw if product id is wrong
        // Update the selected product
        const product = await this.prismaClient.product.update({
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
        const payload = {
            title: 'Product',
            description: `${product_title} has updated`,
        };
        notification.createNotificationService(payload);
        return product;
    }
    // Service to delete a product
    async deleteProductService(product_id) {
        // Check whether the product exists or not
        const exisitingProduct = await this.prismaClient.product.findUnique({
            where: { product_id },
        });
        if (!exisitingProduct)
            throw new Error(`Provided product-id is incorrect`); // Throw if product id is wrong
        // Delete product
        const product = await this.prismaClient.product.delete({
            where: {
                product_id,
            },
        });
        return product;
    }
    // Service to add subcategory for a category
    async addSubcategoryService(subcategory_name, subcategory_image, category_name) {
        const exisitingSubcategory = await this.prismaClient.subcategory.findUnique({
            where: {
                subcategory_name,
            },
        });
        if (exisitingSubcategory)
            throw new Error('Subcategory already exist');
        const category = await this.prismaClient.category.findUnique({
            where: {
                category_name,
            },
        });
        if (!category)
            throw new Error('Provided category is invalid or unavailable');
        const subcategory = await this.prismaClient.subcategory.create({
            data: {
                subcategory_name,
                subcategory_image,
                category_id: category.category_id,
            },
        });
        const payload = {
            title: 'Subcategory',
            description: `New ${subcategory_name} has been added`,
        };
        notification.createNotificationService(payload);
        return subcategory;
    }
    // Service to fetch all subcategories
    async getAllSubcategoriesService() {
        return await this.prismaClient.subcategory.findMany({
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
    }
    // Service to fetch single subcategory
    async getSingleSubcategoryService(subcategory_id) {
        const subcategory = await this.prismaClient.subcategory.findUnique({
            where: {
                subcategory_id,
            },
        });
        if (!subcategory)
            throw new Error('Invalid subcategory');
        return await this.prismaClient.subcategory.findMany({
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
    }
    // Service to update subcategory
    async updateSubcategoryService(subcategory_id, subcategory_name, subcategory_image) {
        const subcategory = await this.prismaClient.subcategory.findUnique({
            where: {
                subcategory_id,
            },
        });
        if (!subcategory)
            throw new Error('Invalid subcategory');
        const subcategories = await this.prismaClient.subcategory.update({
            where: {
                subcategory_id,
            },
            data: {
                subcategory_name,
                subcategory_image,
            },
        });
        const payload = {
            title: 'Subcategory',
            description: `${subcategory_name} has updated`,
        };
        notification.createNotificationService(payload);
        return subcategories;
    }
    // Service to get all subcategory by their categories
    async getAllSubcategoriesUnderCategoryService(category_id) {
        const subcategory = await this.prismaClient.subcategory.findMany({
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
    }
    // Service to delete subcategory
    async deleteSubcategoryService(subcategory_id) {
        const subcategory = await this.prismaClient.subcategory.findUnique({
            where: {
                subcategory_id,
            },
        });
        if (!subcategory?.subcategory_id)
            throw new Error('Invalid subcategory ID');
        return await this.prismaClient.subcategory.delete({
            where: {
                subcategory_id,
            },
        });
    }
    // Service to add category for products
    async addCategoryService(category_name, category_image) {
        const exisitingCategory = await this.prismaClient.category.findUnique({
            where: {
                category_name,
            },
        });
        if (exisitingCategory)
            throw new Error('This category already exists');
        const category = await this.prismaClient.category.create({
            data: {
                category_name,
                category_image,
            },
        });
        const payload = {
            title: 'Category',
            description: `New ${category_name} has been added`,
        };
        notification.createNotificationService(payload);
        return category;
    }
    // Service to fetch all categories for product
    async getAllCategoriesService() {
        return await this.prismaClient.category.findMany();
    }
    // Service to fetch all category names for product
    async getAllCategoryNameService() {
        return await this.prismaClient.category.findMany({
            select: {
                category_id: true,
                category_name: true,
            },
        });
    }
    // Service to fetch single category for product
    async getSingleCategoryService(category_id) {
        const category = await this.prismaClient.category.findUnique({
            where: {
                category_id,
            },
        });
        if (!category)
            throw new Error('Invalid Category');
        return category;
    }
    // Service to update a category
    async updateCategoryService(category_id, category_name, category_image) {
        const category = await this.prismaClient.category.findUnique({
            where: {
                category_id,
            },
        });
        if (!category)
            throw new Error('Invalid Category');
        const categories = await this.prismaClient.category.update({
            where: {
                category_id,
            },
            data: {
                category_name,
                category_image,
            },
        });
        const payload = {
            title: 'Category',
            description: `${category_name} has updated`,
        };
        notification.createNotificationService(payload);
        return categories;
    }
    // Service to delete a category for product
    async deleteCategoryService(category_id) {
        return await this.prismaClient.category.delete({
            where: {
                category_id,
            },
        });
    }
}
