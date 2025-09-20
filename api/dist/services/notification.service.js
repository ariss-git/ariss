import { prisma } from '@/db/prismaSingleton.js';
export class NotificationService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    // Create notification service method
    async createNotificationService(data) {
        // Create notification
        const notification = await this.prismaClient.notification.create({
            data: {
                title: data.title,
                description: data.description,
                panel_user_id: data.panelId || null,
                dealer_user_id: data.dealerId || null,
                technician_user_id: data.technicianId || null,
                backoffice_user_id: data.backofficeId || null,
            },
        });
        return notification;
    }
    // Fetch all unread notification service method
    async fetchAllUnreadNotificationService() {
        return await this.prismaClient.notification.findMany({
            where: {
                is_read: false,
            },
            include: {
                panelUsers: true,
                dealers: true,
                technicians: true,
                backOffice: true,
            },
        });
    }
    // Fetch all notification service method
    async fetchAllNotificationService() {
        return await this.prismaClient.notification.findMany({
            include: {
                panelUsers: true,
                dealers: true,
                technicians: true,
                backOffice: true,
            },
        });
    }
    // Read all notifications service method
    async readAllNotifications() {
        return await this.prismaClient.notification.updateMany({
            data: {
                is_read: true,
            },
        });
    }
    // Delete all notifications service method
    async deleteAllNotifications() {
        return await this.prismaClient.notification.deleteMany();
    }
}
