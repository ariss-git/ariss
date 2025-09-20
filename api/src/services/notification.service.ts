import { prisma } from '@/db/prismaSingleton.js';

type CreateNotification = {
    title: string;
    description: string;
    panelId?: string;
    dealerId?: string;
    technicianId?: string;
    backofficeId?: string;
};

export class NotificationService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    // Create notification service method
    async createNotificationService(data: CreateNotification) {
        // Create notification
        const notification = await this.prismaClient.notification.create({
            data: {
                title: data.title,
                description: data.description,
                panel_user_id: data.panelId,
                dealer_user_id: data.dealerId,
                technician_user_id: data.technicianId,
                backoffice_user_id: data.backofficeId,
            },
        });

        return notification;
    }

    // Fetch all notification service method
    async fetchAllNotificationService() {
        return await this.prismaClient.notification.findMany();
    }
}
