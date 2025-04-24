// src/controllers/course.controller.ts

import { Request, Response } from 'express';
import * as courseServices from '../services/course.service.js'; // Import all course-related service functions

// Controller to handle course creation
export const createCourseController = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        // Call the service to create the course
        const course = await courseServices.createCourseService({ title, content });

        // Respond with success and the created course data
        return res.status(201).json({ success: true, data: course });
    } catch (error: any) {
        // Handle unexpected errors
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to handle course update
export const updateCourseController = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;
        const { title, content } = req.body;

        // Call the service to update course fields
        const course = await courseServices.updateCourseService(course_id, { title, content });

        // Respond with updated course data
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to handle course deletion
export const deleteCourseController = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;

        // Delete the course using service layer
        const course = await courseServices.deleteCourseService(course_id);

        // Return a success message with the course title
        return res.status(200).json({ success: true, message: `${course.title} deleted successfully` });
    } catch (error: any) {
        // Use 400 status for client-side issues like not found
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Controller to publish a course
export const publishCourseController = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;

        // Set isPublished to true in DB
        const course = await courseServices.publishCourseService(course_id);

        // Send confirmation with the course title
        return res
            .status(200)
            .json({ success: true, message: `${course.title} has been published successfully` });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to unpublish a course
export const unpublishCourseController = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;

        // Set isPublished to true in DB
        const course = await courseServices.unpublishCourseService(course_id);

        // Send confirmation with the course title
        return res
            .status(200)
            .json({ success: true, message: `${course.title} has been unpublished successfully` });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to fetch all courses
export const getAllCoursesController = async (_req: Request, res: Response) => {
    try {
        const courses = await courseServices.fetchAllCoursesService();
        return res.status(200).json({ success: true, totat: courses.length, data: courses });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Controller to fetch a single course
export const getCourseController = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;

        if (!course_id) {
            return res.status(400).json({ success: false, message: 'course id is required' });
        }

        const course = await courseServices.fetchCourseService(course_id);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
