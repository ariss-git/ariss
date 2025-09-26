-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('OPTION_A', 'OPTION_B', 'OPTION_C', 'OPTION_D');

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
CREATE UNIQUE INDEX "Test_question_key" ON "Test"("question");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;
