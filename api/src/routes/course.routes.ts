import * as courseControllers from '../controllers/course.controller.js';
import { Router } from 'express';

const courseRoutes = Router();

courseRoutes.post('/', courseControllers.createCourseController);

export default courseRoutes;
