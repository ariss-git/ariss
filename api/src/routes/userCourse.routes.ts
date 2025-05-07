import { Router } from 'express';
import * as userController from '../controllers/userCourses.controller.js';

const userCourseRouter = Router();

// Enroll a user in a course
userCourseRouter.post('/enroll/:courseId', userController.enrollInCourse);

// Take a test for a course
userCourseRouter.post('/test/:courseId', userController.takeTest);

// Get results for a user for a specific course
userCourseRouter.get('/results/:courseId', userController.getUserResults);

// Retake the test for a user if failed
userCourseRouter.post('/retake/:courseId', userController.retakeTest);

// Retake the test for a user if failed
userCourseRouter.get('/', userController.fetchAllActiveCourses);

export default userCourseRouter;
