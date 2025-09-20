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

-- CreateIndex
CREATE UNIQUE INDEX "PanelUsers_email_key" ON "PanelUsers"("email");
