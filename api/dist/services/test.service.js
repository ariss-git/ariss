import { prisma } from '@/db/prismaSingleton.js';
import { NotificationService } from './notification.service.js';
const notification = new NotificationService();
export class TestServices {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    async addQuestion(question, optionA, optionB, optionC, optionD, correctOption, courseId) {
        const existingQuestion = await this.prismaClient.test.findUnique({
            where: {
                question,
            },
        });
        if (existingQuestion)
            throw new Error('Question already exists');
        const test = await this.prismaClient.test.create({
            data: {
                question,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                correct_option: correctOption,
                course_id: courseId,
            },
        });
        const payload = {
            title: 'Question',
            description: `Question ${question} added for the course`,
        };
        notification.createNotificationService(payload);
        return test;
    }
    async getAllQuestions() {
        return await this.prismaClient.test.findMany({
            include: {
                course: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async getSingleQuestion(testId) {
        return await this.prismaClient.test.findUnique({
            where: {
                test_id: testId,
            },
            include: {
                course: true,
            },
        });
    }
    async updateQuestion(testId, question, optionA, optionB, optionC, optionD, correctOption, courseId) {
        const existingQuestion = await this.prismaClient.test.findUnique({
            where: {
                test_id: testId,
            },
        });
        if (!existingQuestion)
            throw new Error('Question not found');
        return await this.prismaClient.test.update({
            where: {
                test_id: testId,
            },
            data: {
                question,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                correct_option: correctOption,
                course_id: courseId,
            },
        });
    }
    async deleteQuestion(testId) {
        const question = await this.prismaClient.test.delete({
            where: {
                test_id: testId,
            },
        });
        const payload = {
            title: 'Question',
            description: `Question ${question.question} deleted`,
        };
        notification.createNotificationService(payload);
        return question;
    }
}
