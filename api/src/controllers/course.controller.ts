// controllers/admin/course.controller.ts

import { Request, Response } from 'express';
import * as courseService from '../services/course.service.js';

export const createCourse = async (req: Request, res: Response) => {
    const { title, description, content } = req.body;

    try {
        const newCourse = await courseService.createCourse({ title, description, content });
        return res.status(201).json(newCourse); // Respond with created course data
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const addQuestionsToCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const questions = req.body; // Array of questions to add

    try {
        const addedQuestions = await courseService.addQuestionsToCourse(courseId, questions);
        return res.status(201).json(addedQuestions); // Respond with the added questions
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const editCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { title, description } = req.body;

    try {
        const updatedCourse = await courseService.editCourse(courseId, { title, description });
        return res.status(200).json(updatedCourse); // Respond with updated course
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await courseService.getAllCourses();
        return res.status(200).json(courses); // Respond with list of courses
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    const { courseId } = req.params;

    try {
        const course = await courseService.getCourseById(courseId);
        return res.status(200).json(course); // Respond with course details
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const toggleCourseStatus = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { isActive } = req.body; // Whether to activate or deactivate the course

    try {
        const updatedCourse = await courseService.toggleCourseStatus(courseId, isActive);
        return res.status(200).json(updatedCourse); // Respond with updated course
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const getPassedFailedUsers = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { status } = req.query; // Either "PASSED" or "FAILED"

    try {
        const users = await courseService.getPassedFailedUsers(courseId, status as 'PASSED' | 'FAILED');
        return res.status(200).json(users); // Respond with list of users
    } catch (error: any) {
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Get all questions controller
export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;

        const questions = await courseService.fetchAllQuestions(courseId);
        return res.status(200).json(questions);
    } catch (error: any) {
        return res.status(400).json({ error: error.message }); // Handle errors
    }
};
