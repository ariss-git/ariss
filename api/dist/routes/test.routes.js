import { Router } from 'express';
import * as testControllers from '../controllers/test.controller.js';
const testRoutes = Router();
testRoutes.post('/', testControllers.addQuestionController);
testRoutes.get('/', testControllers.getAllQuestionsController);
testRoutes.get('/:testId', testControllers.getSingleQuestionController);
testRoutes.delete('/:testId', testControllers.deleteQuestionController);
testRoutes.put('/edit/:testId', testControllers.updateQuestionController);
export default testRoutes;
