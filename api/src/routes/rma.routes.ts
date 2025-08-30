// src/routes/rma.routes.ts

import * as rmaControllers from '../controllers/rma.controller.js';
import { Router } from 'express';

const rmaRoutes = Router();

// @route   POST /rma
// @desc    Submit a new RMA request
rmaRoutes.post('/', rmaControllers.rmaRequestFormController);

// @route   PUT /rma/accept/:rma_id
// @desc    Mark RMA request as Accepted
rmaRoutes.put('/accept/:rma_id', rmaControllers.rmaRequestAcceptedController);

// @route   PUT /rma/reject/:rma_id
// @desc    Mark RMA request as Rejected
rmaRoutes.put('/reject/:rma_id', rmaControllers.rmaRequestRejectedController);

// @route   PUT /rma/resolve/:rma_id
// @desc    Mark RMA request as Resolved
rmaRoutes.put('/resolve/:rma_id', rmaControllers.rmaRequestResolvedController);

// @route   GET /rma
// @desc    Fetch all RMA requests
rmaRoutes.get('/', rmaControllers.getAllRMAController);

// @route   GET /rma/:rma_id
// @desc    Fetch a single RMA request by ID
rmaRoutes.get('/:rma_id', rmaControllers.getSingleRMAController);

// @route   DELETE /rma/:rma_id
// @desc    Delete a specific RMA request
rmaRoutes.delete('/:rma_id', rmaControllers.deleteRMARequestController);

export default rmaRoutes;
