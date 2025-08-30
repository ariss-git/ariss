/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_dealer_id_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_product_id_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Result";

-- DropTable
DROP TABLE "Wishlist";

-- DropEnum
DROP TYPE "CourseStatus";

-- DropEnum
DROP TYPE "EmployeeType";
