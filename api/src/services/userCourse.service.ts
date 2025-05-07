import { prisma } from '../db/prismaSingleton.js';

export const enrollInCourse = async (
    courseId: string,
    userId: string,
    userName: string,
    businessName: string
) => {
    // 1. Check if the course exists and is active
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });
    if (!course || !course.isActive) {
        throw new Error('Course not found or is not active');
    }

    // 2. Check if the user is already enrolled
    const existingResult = await prisma.result.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    if (existingResult) {
        throw new Error('User is already enrolled in this course');
    }

    // 3. Create a new enrollment for the user
    const result = await prisma.result.create({
        data: {
            userId,
            userName,
            businessName,
            courseId,
            score: 0,
            percentage: 0,
            status: 'FAILED', // Initial status is FAILED until the test is taken
            attempts: 1,
        },
    });

    return result;
};

export const takeTest = async (courseId: string, userId: string, answers: string[]) => {
    // 1. Fetch the course and questions
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { questions: true },
    });
    if (!course) {
        throw new Error('Course not found');
    }

    // 2. Calculate score
    let score = 0;
    let totalQuestions = course.questions.length;

    // Loop through each answer and calculate score
    for (let i = 0; i < totalQuestions; i++) {
        const question = course.questions[i];
        if (answers[i] === question.correct) {
            score += 2; // 2 points for a correct answer
        }
    }

    // 3. Calculate percentage
    const percentage = (score / (totalQuestions * 2)) * 100;

    // 4. Determine result status
    const status = percentage >= 35 ? 'PASSED' : 'FAILED';

    // 5. Update the result in the database
    const result = await prisma.result.update({
        where: { userId_courseId: { userId, courseId } },
        data: {
            score,
            percentage,
            status,
            attempts: {
                increment: 1, // Increment attempts on every test taken
            },
        },
    });

    return result;
};

export const getUserResults = async (courseId: string, userId: string) => {
    // 1. Fetch the result for the user
    const result = await prisma.result.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });

    if (!result) {
        throw new Error('Result not found for this user');
    }

    return result;
};

export const retakeTest = async (courseId: string, userId: string) => {
    // 1. Fetch the user's result for the course
    const result = await prisma.result.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });

    if (!result) {
        throw new Error('Result not found for this user');
    }

    // 2. Check if the user has failed
    if (result.status === 'PASSED') {
        throw new Error('User has already passed the test');
    }

    // 3. Reset score and percentage for retake
    const updatedResult = await prisma.result.update({
        where: { userId_courseId: { userId, courseId } },
        data: {
            score: 0,
            percentage: 0,
            status: 'FAILED', // Reset status to failed for retake
            attempts: {
                increment: 1, // Increment attempts for retake
            },
        },
    });

    return updatedResult;
};

// Service to fetch all active course
export const activeCourse = async () => {
    return await prisma.course.findMany({
        where: {
            isActive: true,
        },
    });
};
