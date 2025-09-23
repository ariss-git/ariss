import { prisma } from '@/db/prismaSingleton.js';
import { NotificationService } from './notification.service.js';

const notification = new NotificationService();

export class CourseServices {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    async createCourse(title: string, content: any) {
        const existingCourse = await this.prismaClient.course.findUnique({
            where: {
                title,
            },
        });

        if (existingCourse) throw new Error('Course with this title already exists');

        const course = await this.prismaClient.course.create({
            data: {
                title,
                content,
                status: true,
            },
        });

        const payload = {
            title: 'Course',
            description: `New course with title ${title} has been added`,
        };

        notification.createNotificationService(payload);

        return course;
    }

    async fetchAllCourses() {
        return await this.prismaClient.course.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async fetchSingleCourse(courseId: string) {
        return await this.prismaClient.course.findUnique({
            where: {
                course_id: courseId,
            },
        });
    }

    async fetchActiveCourses() {
        return await this.prismaClient.course.findMany({
            where: {
                status: true,
            },
        });
    }

    async updateToActiveCourse(courseId: string) {
        return await this.prismaClient.course.update({
            where: {
                course_id: courseId,
            },
            data: {
                status: true,
            },
        });
    }

    async updateToInactiveCourse(courseId: string) {
        return await this.prismaClient.course.update({
            where: {
                course_id: courseId,
            },
            data: {
                status: false,
            },
        });
    }

    async updateCourse(courseId: string, title: string, content: any) {
        const existingCourse = await this.prismaClient.course.findUnique({
            where: {
                course_id: courseId,
            },
        });

        if (!existingCourse) throw new Error('Course with this ID do not exist');

        const course = await this.prismaClient.course.update({
            where: {
                course_id: courseId,
            },
            data: {
                title,
                content,
            },
        });

        const payload = {
            title: 'Course',
            description: `Course with title ${title} has been updated`,
        };

        notification.createNotificationService(payload);

        return course;
    }

    async deleteCourse(courseId: string) {
        return await this.prismaClient.course.delete({
            where: {
                course_id: courseId,
            },
        });
    }
}
