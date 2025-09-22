import * as courseControllers from '../controllers/course.controller.js';
import { Router } from 'express';

const courseRoutes = Router();

courseRoutes.post('/', courseControllers.createCourseController);
courseRoutes.get('/', courseControllers.fetchAllCoursesController);
courseRoutes.get('/:courseId', courseControllers.fetchSingleCourseController);
courseRoutes.get('/active', courseControllers.fetchAllActiveCoursesController);
courseRoutes.put('/active/:courseId', courseControllers.updateToActiveCourseController);
courseRoutes.put('/inactive/:courseId', courseControllers.updateToInactiveCourseController);

export default courseRoutes;
