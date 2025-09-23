import { Router } from 'express';
import * as testControllers from '../controllers/test.controller.js';

const testRoutes = Router();

testRoutes.post('/', testControllers.addQuestionController);

testRoutes.get('/', testControllers.getAllQuestionsController);

testRoutes.delete('/', testControllers.deleteQuestionController);

export default testRoutes;
