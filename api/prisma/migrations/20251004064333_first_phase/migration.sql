-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('OPTION_A', 'OPTION_B', 'OPTION_C', 'OPTION_D');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('DEALER', 'TECHNICIAN', 'BACKOFFICE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('ONLINE', 'CREDIT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RMAStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "PanelUserType" AS ENUM ('ADMIN', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "PanelUsers" (
    "panel_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_pic" TEXT,
    "panel_type" "PanelUserType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PanelUsers_pkey" PRIMARY KEY ("panel_id")
);

-- CreateTable
CREATE TABLE "Dealers" (
    "dealer_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "business_name" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "shipping_address" JSONB,
    "billing_address" JSONB,
    "profile_pic" TEXT NOT NULL DEFAULT 'https://static.thenounproject.com/png/5034901-200.png',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "usertype" "UserType" NOT NULL,
    "isDistributor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dealers_pkey" PRIMARY KEY ("dealer_id")
);

-- CreateTable
CREATE TABLE "Technicians" (
    "tech_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "profile_pic" TEXT,
    "usertype" "UserType" NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dealerid" TEXT NOT NULL,

    CONSTRAINT "Technicians_pkey" PRIMARY KEY ("tech_id")
);

-- CreateTable
CREATE TABLE "BackOffice" (
    "backoffice_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_pic" TEXT,
    "usertype" "UserType" NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dealerid" TEXT NOT NULL,

    CONSTRAINT "BackOffice_pkey" PRIMARY KEY ("backoffice_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "product_title" TEXT NOT NULL,
    "product_sku" TEXT,
    "product_type" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "product_image" TEXT[],
    "product_warranty" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_label" TEXT NOT NULL,
    "product_visibility" TEXT NOT NULL,
    "product_usps" TEXT,
    "product_keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brand_id" TEXT,
    "subcategory_id" TEXT,
    "category_id" TEXT,
    "product_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "subcategory_id" TEXT NOT NULL,
    "subcategory_name" TEXT NOT NULL,
    "subcategory_image" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("subcategory_id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "discount_id" TEXT NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coupon_code" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "percentage" DOUBLE PRECISION,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("discount_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "usertype" TEXT NOT NULL,
    "product_id" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "coupon_code" TEXT,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_mode" "PaymentMode" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "ledger_id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance_due" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3),
    "payment_mode" "PaymentMode" NOT NULL DEFAULT 'CREDIT',
    "quantity" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "usertype" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("ledger_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "RMA" (
    "rma_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "RMAStatus" NOT NULL DEFAULT 'PENDING',
    "product_name" TEXT NOT NULL,
    "product_serial" TEXT NOT NULL,
    "product_issue" TEXT NOT NULL,
    "product_images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RMA_pkey" PRIMARY KEY ("rma_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "panel_user_id" TEXT,
    "dealer_user_id" TEXT,
    "technician_user_id" TEXT,
    "backoffice_user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Course" (
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "Test" (
    "test_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_option" "OptionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("test_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PanelUsers_email_key" ON "PanelUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dealers_phone_key" ON "Dealers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Dealers_email_key" ON "Dealers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dealers_gstin_key" ON "Dealers"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_title_key" ON "Product"("product_title");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_subcategory_name_key" ON "Subcategory"("subcategory_name");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_dealer_id_product_id_key" ON "Discount"("dealer_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_product_id_key" ON "Ledger"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "RMA_email_key" ON "RMA"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RMA_phone_key" ON "RMA"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "RMA_product_serial_key" ON "RMA"("product_serial");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Test_question_key" ON "Test"("question");

-- AddForeignKey
ALTER TABLE "Technicians" ADD CONSTRAINT "Technicians_dealerid_fkey" FOREIGN KEY ("dealerid") REFERENCES "Dealers"("dealer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackOffice" ADD CONSTRAINT "BackOffice_dealerid_fkey" FOREIGN KEY ("dealerid") REFERENCES "Dealers"("dealer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("subcategory_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "Dealers"("dealer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_panel_user_id_fkey" FOREIGN KEY ("panel_user_id") REFERENCES "PanelUsers"("panel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_dealer_user_id_fkey" FOREIGN KEY ("dealer_user_id") REFERENCES "Dealers"("dealer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_technician_user_id_fkey" FOREIGN KEY ("technician_user_id") REFERENCES "Technicians"("tech_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_backoffice_user_id_fkey" FOREIGN KEY ("backoffice_user_id") REFERENCES "BackOffice"("backoffice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;
