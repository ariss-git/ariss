/*
  Warnings:

  - You are about to drop the column `dealer_id` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `dealer_id` on the `Order` table. All the data in the column will be lost.
  - Added the required column `business_name` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usertype` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usertype` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ledger" DROP CONSTRAINT "Ledger_dealer_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_dealer_id_fkey";

-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "dealer_id",
ADD COLUMN     "business_name" TEXT NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "usertype" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dealer_id",
ADD COLUMN     "business_name" TEXT NOT NULL,
ADD COLUMN     "coupon_code" TEXT,
ADD COLUMN     "delivery_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "usertype" TEXT NOT NULL;
