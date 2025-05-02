/*
  Warnings:

  - Added the required column `business_name` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usertype` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "business_name" TEXT NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "usertype" TEXT NOT NULL;
