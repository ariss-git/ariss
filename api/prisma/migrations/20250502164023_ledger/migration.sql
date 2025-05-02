/*
  Warnings:

  - You are about to drop the column `business_name` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `total_due` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `usertype` on the `Ledger` table. All the data in the column will be lost.
  - Added the required column `total` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "business_name",
DROP COLUMN "shipping_address",
DROP COLUMN "total_due",
DROP COLUMN "username",
DROP COLUMN "usertype",
ADD COLUMN     "payment_mode" "PaymentMode" NOT NULL DEFAULT 'CREDIT',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "amount_paid" SET DEFAULT 0,
ALTER COLUMN "due_date" DROP NOT NULL;
