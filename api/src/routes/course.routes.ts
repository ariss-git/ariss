// src/routes/course.routes.ts

import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';

const adminCourseRouter = Router();

// Route to create a new course
adminCourseRouter.post('/courses', courseController.createCourse);

// Route to add questions to a specific course
adminCourseRouter.post('/courses/:courseId/questions', courseController.addQuestionsToCourse);

// Route to edit course title and description
adminCourseRouter.put('/courses/:courseId', courseController.editCourse);

// Route to get all courses
adminCourseRouter.get('/courses', courseController.getAllCourses);

// Route to get details of a single course
adminCourseRouter.get('/courses/:courseId', courseController.getCourseById);

// Route to toggle course active status (activate/deactivate)
adminCourseRouter.put('/courses/:courseId/status', courseController.toggleCourseStatus);

// Route to get users who passed or failed the course
adminCourseRouter.get('/courses/:courseId/results', courseController.getPassedFailedUsers);

export default adminCourseRouter;
