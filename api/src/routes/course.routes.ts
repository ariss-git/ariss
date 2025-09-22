import * as courseControllers from '../controllers/course.controller.js';
import { Router } from 'express';

const courseRoutes = Router();

courseRoutes.post('/', courseControllers.createCourseController);

courseRoutes.get('/', courseControllers.fetchAllCoursesController);
courseRoutes.get('/:courseId', courseControllers.fetchSingleCourseController);
courseRoutes.get('/active', courseControllers.fetchAllActiveCoursesController);

courseRoutes.put('/active/:courseId', courseControllers.updateToActiveCourseController);
courseRoutes.put('/inactive/:courseId', courseControllers.updateToInactiveCourseController);
courseRoutes.put('/:courseId', courseControllers.updateCourseController);

courseRoutes.delete('/:courseId', courseControllers.deleteCourseController);

export default courseRoutes;
