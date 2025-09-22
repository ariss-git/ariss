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
