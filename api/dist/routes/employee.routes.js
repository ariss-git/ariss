// src/routes/employee.routes.ts
import * as employeeControllers from '../controllers/employee.controller.js';
import { employeeMiddleware } from '../middleware/employee.middleware.js';
import { Router } from 'express';
const empRoutes = Router();
empRoutes.post('/register', employeeControllers.employeeRegisterController);
empRoutes.post('/login', employeeControllers.employeeLoginController);
empRoutes.post('/logout', employeeControllers.employeeLogoutController);
empRoutes.get('/profile', employeeMiddleware, employeeControllers.getEmployeeProfileController);
empRoutes.get('/approved', employeeControllers.getAllApprovedEmployeesController);
empRoutes.get('/disapproved', employeeControllers.getAllDispprovedEmployeesController);
empRoutes.patch('/approval/:emp_id', employeeControllers.approvedEmployeeController);
empRoutes.patch('/disapproval/:emp_id', employeeControllers.disapprovedEmployeeController);
export default empRoutes;
