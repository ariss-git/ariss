import { CourseServices } from '@/services/course.service.js';
import { Request, Response } from 'express';

const courseServices = new CourseServices();

export const createCourseController = async (req: Request, res: Response) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(404).json({ success: false, message: 'All fields are required' });
    }

    try {
        const course = await courseServices.createCourse(title, content);
        return res.status(201).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchAllCoursesController = async (_req: Request, res: Response) => {
    try {
        const course = await courseServices.fetchAllCourses();
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchSingleCourseController = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(404).json({ success: false, message: 'Course ID not found in params' });
    }

    try {
        const course = await courseServices.fetchSingleCourse(courseId);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchAllActiveCoursesController = async (_req: Request, res: Response) => {
    try {
        const course = await courseServices.fetchActiveCourses();
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const updateToActiveCourseController = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(404).json({ success: false, message: 'Course ID not found in params' });
    }

    try {
        const course = await courseServices.updateToActiveCourse(courseId);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateToInactiveCourseController = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(404).json({ success: false, message: 'Course ID not found in params' });
    }

    try {
        const course = await courseServices.updateToInactiveCourse(courseId);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCourseController = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { title, content } = req.body;

    if (!courseId) {
        return res.status(404).json({ success: false, message: 'Course ID not found in params' });
    }

    if (!title || !content) {
        return res.status(404).json({ success: false, message: 'Required fields are missing' });
    }

    try {
        const course = await courseServices.updateCourse(courseId, title, content);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCourseController = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(404).json({ success: false, message: 'Course ID not found in params' });
    }

    try {
        const course = await courseServices.deleteCourse(courseId);
        return res.status(200).json({ success: true, data: course });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
