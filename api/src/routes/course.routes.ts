import * as courseControllers from '../controllers/course.controller.js';
import { Router } from 'express';

const courseRoutes = Router();

courseRoutes.post('/', courseControllers.createCourseController);
courseRoutes.get('/', courseControllers.fetchAllCoursesController);
courseRoutes.get('/:courseId', courseControllers.fetchSingleCourseController);
courseRoutes.get('/active', courseControllers.fetchAllActiveCoursesController);

export default courseRoutes;
