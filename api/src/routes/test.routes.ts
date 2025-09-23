import { Router } from 'express';
import * as testControllers from '../controllers/test.controller.js';

const testRoutes = Router();

testRoutes.post('/', testControllers.addQuestionController);

export default testRoutes;
