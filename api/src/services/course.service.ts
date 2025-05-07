// services/course.service.ts

import { prisma } from '../db/prismaSingleton.js';

// Create a new course
export const createCourse = async (data: { title: string; description: string; content: string }) => {
    try {
        const newCourse = await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                content: data.content,
                isActive: false, // Default inactive
            },
        });
        return newCourse;
    } catch (error: any) {
        throw new Error('Failed to create course: ' + error.message);
    }
};

// Add questions to an existing course
export const addQuestionsToCourse = async (
    courseId: string,
    questions: Array<{
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correct: string;
    }>
) => {
    try {
        // Fetch the current number of questions for the course
        const currentQuestions = await prisma.question.count({ where: { courseId } });

        if (currentQuestions >= 20) {
            throw new Error('You cannot add more than 20 questions to a course.');
        }

        // Add new questions
        const newQuestions = await prisma.question.createMany({
            data: questions.map((q) => ({
                courseId: courseId,
                text: q.text,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correct: q.correct,
            })),
        });

        return newQuestions;
    } catch (error: any) {
        throw new Error('Failed to add questions: ' + error.message);
    }
};

// Edit a course's title and description
export const editCourse = async (courseId: string, data: { title?: string; description?: string }) => {
    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                title: data.title,
                description: data.description,
            },
        });
        return updatedCourse;
    } catch (error: any) {
        throw new Error('Failed to edit course: ' + error.message);
    }
};

// Get all courses
export const getAllCourses = async () => {
    try {
        const courses = await prisma.course.findMany();
        return courses;
    } catch (error: any) {
        throw new Error('Failed to fetch courses: ' + error.message);
    }
};

// Get a single course by ID with questions
export const getCourseById = async (courseId: string) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { questions: true }, // Include related questions
        });
        return course;
    } catch (error: any) {
        throw new Error('Failed to fetch course: ' + error.message);
    }
};

// Toggle course status (active/inactive)
export const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: { isActive: isActive },
        });
        return updatedCourse;
    } catch (error: any) {
        throw new Error('Failed to update course status: ' + error.message);
    }
};

// Get users who passed/failed the course
export const getPassedFailedUsers = async (courseId: string, status: 'PASSED' | 'FAILED') => {
    try {
        const users = await prisma.result.findMany({
            where: {
                courseId: courseId,
                status: status,
            },
            include: {
                course: true, // Include course details (courseName, etc.)
            },
        });

        return users.map((user) => ({
            fullName: user.userName,
            businessName: user.businessName,
            courseName: user.course.title, // We join the course name
            score: user.score,
            percentage: user.percentage,
        }));
    } catch (error: any) {
        throw new Error('Failed to fetch users: ' + error.message);
    }
};

// Get all questions
export const fetchAllQuestions = async (courseId: string) => {
    return await prisma.question.findMany({
        where: {
            courseId,
        },
    });
};
