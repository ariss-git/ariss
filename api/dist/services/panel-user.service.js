// src/services/panel-user.service.ts
import { prisma } from '@/db/prismaSingleton.js';
/**
 * @class PanelUserService
 * @desc Service class to handle panel-user-related operations
 */
export class PanelUserService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    // Service to create panel user
    async createPanelUserService(panelId, email, name, profilePic, panelType) {
        // Check if exists
        const existingUser = await this.prismaClient.panelUsers.findUnique({
            where: {
                email,
            },
        });
        if (existingUser)
            throw new Error('Panel User already exists');
        // Create panel user
        return await this.prismaClient.panelUsers.create({
            data: {
                panel_id: panelId,
                email: email,
                name: name,
                profile_pic: profilePic,
                panel_type: panelType,
            },
        });
    }
    // Service to fetch all users
    async getAllPanelUsersService() {
        return await this.prismaClient.panelUsers.findMany();
    }
}
