/*
  Warnings:

  - You are about to drop the column `order_id` on the `Ledger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `Ledger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ledger" DROP CONSTRAINT "Ledger_order_id_fkey";

-- DropIndex
DROP INDEX "Ledger_order_id_key";

-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "order_id",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_product_id_key" ON "Ledger"("product_id");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
