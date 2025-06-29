// src/routes/rma.routes.ts
import { rmaRequestFormController, rmaRequestAcceptedController, rmaRequestRejectedController, rmaRequestResolvedController, getAllRMAController, getSingleRMAController, deleteRMARequestController, } from '../controllers/rma.controller.js';
import { Router } from 'express';
const rmaRoutes = Router();
// @route   POST /rma
// @desc    Submit a new RMA request
rmaRoutes.post('/', rmaRequestFormController);
// @route   PUT /rma/accept/:rma_id
// @desc    Mark RMA request as Accepted
rmaRoutes.put('/accept/:rma_id', rmaRequestAcceptedController);
// @route   PUT /rma/reject/:rma_id
// @desc    Mark RMA request as Rejected
rmaRoutes.put('/reject/:rma_id', rmaRequestRejectedController);
// @route   PUT /rma/resolve/:rma_id
// @desc    Mark RMA request as Resolved
rmaRoutes.put('/resolve/:rma_id', rmaRequestResolvedController);
// @route   GET /rma
// @desc    Fetch all RMA requests
rmaRoutes.get('/', getAllRMAController);
// @route   GET /rma/:rma_id
// @desc    Fetch a single RMA request by ID
rmaRoutes.get('/:rma_id', getSingleRMAController);
// @route   DELETE /rma/:rma_id
// @desc    Delete a specific RMA request
rmaRoutes.delete('/:rma_id', deleteRMARequestController);
export default rmaRoutes;
