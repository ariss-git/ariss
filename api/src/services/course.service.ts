// src/services/course.service.ts

import { prisma } from '../db/prismaSingleton.js';

// Type definition for creating a new course
interface CourseCreateInput {
    title: string;
    content: string;
}

// Create a new course
export const createCourseService = async (data: CourseCreateInput) => {
    // Guard clause: Title and content must be provided
    if (!data.title || !data.content) {
        throw new Error('Course title and content cannot be empty');
    }

    // Check if a course with the same title already exists
    const existingCourse = await prisma.course.findFirst({
        where: {
            title: data.title,
        },
    });

    if (existingCourse) {
        throw new Error('This course already exists');
    }

    // Create the course (not published by default)
    return await prisma.course.create({
        data: {
            title: data.title,
            content: data.content,
            isPublished: false,
        },
    });
};

// Update course details (title and/or content)
export const updateCourseService = async (course_id: string, data: Partial<CourseCreateInput>) => {
    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!existingCourse) {
        throw new Error('This course does not exist');
    }

    // Update only the fields that are provided (safe merge)
    return await prisma.course.update({
        where: { course_id },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.content !== undefined && { content: data.content }),
        },
    });
};

// Delete a course by ID
export const deleteCourseService = async (course_id: string) => {
    // Check if the course exists before deleting
    const existingCourse = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });

    if (!existingCourse) {
        throw new Error('Course does not exists');
    }

    // Proceed with deletion
    return await prisma.course.delete({
        where: {
            course_id,
        },
    });
};

// Mark a course as published
export const publishCourseService = async (course_id: string) => {
    // Make sure the course exists before publishing
    const existingCourse = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });

    if (!existingCourse) {
        throw new Error('Course does not exists');
    }

    // Set isPublished to true
    return await prisma.course.update({
        where: {
            course_id,
        },
        data: {
            isPublished: true,
        },
    });
};

// Mark a course as unpublished
export const unpublishCourseService = async (course_id: string) => {
    // Make sure the course exists before publishing
    const existingCourse = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });

    if (!existingCourse) {
        throw new Error('Course does not exists');
    }

    // Set isPublished to false
    return await prisma.course.update({
        where: {
            course_id,
        },
        data: {
            isPublished: false,
        },
    });
};

// Get all Courses
export const fetchAllCoursesService = async () => {
    return await prisma.course.findMany();
};

// Get single Course
export const fetchCourseService = async (course_id: string) => {
    return await prisma.course.findMany({
        where: {
            course_id,
        },
    });
};
