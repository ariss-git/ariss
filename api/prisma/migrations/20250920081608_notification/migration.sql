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

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_panel_user_id_fkey" FOREIGN KEY ("panel_user_id") REFERENCES "PanelUsers"("panel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_dealer_user_id_fkey" FOREIGN KEY ("dealer_user_id") REFERENCES "Dealers"("dealer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_technician_user_id_fkey" FOREIGN KEY ("technician_user_id") REFERENCES "Technicians"("tech_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_backoffice_user_id_fkey" FOREIGN KEY ("backoffice_user_id") REFERENCES "BackOffice"("backoffice_id") ON DELETE CASCADE ON UPDATE CASCADE;
