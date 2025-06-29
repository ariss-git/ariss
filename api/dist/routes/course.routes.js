// src/routes/course.routes.ts
import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
const adminCourseRouter = Router();
// Route to create a new course
adminCourseRouter.post('/', courseController.createCourse);
// Route to add questions to a specific course
adminCourseRouter.post('/:courseId/questions', courseController.addQuestionsToCourse);
// Route to fetch all questions to a specific course
adminCourseRouter.get('/:courseId/questions', courseController.getAllQuestions);
// Route to get all questions
adminCourseRouter.get('/:courseId/questions', courseController.addQuestionsToCourse);
// Route to edit course title and description
adminCourseRouter.put('/:courseId', courseController.editCourse);
// Route to get all courses
adminCourseRouter.get('/', courseController.getAllCourses);
// Route to get details of a single course
adminCourseRouter.get('/:courseId', courseController.getCourseById);
// Route to toggle course active status (activate/deactivate)
adminCourseRouter.put('/:courseId/status', courseController.toggleCourseStatus);
// Route to get users who passed or failed the course
adminCourseRouter.get('/:courseId/results', courseController.getPassedFailedUsers);
export default adminCourseRouter;
