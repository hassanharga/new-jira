import { Router } from 'express';
import { validate } from 'express-validation';
import * as Controllers from '../controllers/features.controller';
import { asyncHandler } from '../utils/asyncHandler';
import * as validators from '../validations/features.validation';

const router = Router();

router
  .route('/')
  .get(validate(validators.getFeatures), asyncHandler(Controllers.getFeatures))
  .post(validate(validators.addFeature), asyncHandler(Controllers.addFeature))
  .put(validate(validators.updateFeature), asyncHandler(Controllers.updateFeature))
  .delete(validate(validators.deleteFeature), asyncHandler(Controllers.deleteFeature));

export default router;
