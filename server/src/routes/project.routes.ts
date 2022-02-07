import { Router } from 'express';
import { validate } from 'express-validation';
import * as Controllers from '../controllers/project.controller';
import { asyncHandler } from '../utils/asyncHandler';
import * as validators from '../validations/project.validation';

const router = Router();

router
  .route('/')
  .get(validate(validators.getProjects), asyncHandler(Controllers.getProjects))
  .post(validate(validators.addProject), asyncHandler(Controllers.addProject))
  .put(validate(validators.updateProject), asyncHandler(Controllers.updateProject))
  .delete(validate(validators.deleteProject), asyncHandler(Controllers.deleteProject));

router.route('/:id').get(validate(validators.getProject), asyncHandler(Controllers.getProject));

export default router;
