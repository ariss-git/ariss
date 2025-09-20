import { Router } from 'express';
import * as panelUserControllers from '../controllers/panel-user.controller.js';

const panelRoutes = Router();

panelRoutes.post('/', panelUserControllers.createPanelUserController);

export default panelRoutes;
