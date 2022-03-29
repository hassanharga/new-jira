import { Router } from 'express';
import { validate } from 'express-validation';
import * as Controllers from '../controllers/issues.controller';
import { asyncHandler } from '../utils/asyncHandler';
import * as validators from '../validations/issues.validation';

const router = Router();

router
  .route('/')
  .post(validate(validators.addIssue), asyncHandler(Controllers.addIssue))
  .put(validate(validators.updateIssue), asyncHandler(Controllers.updateIssue))
  .delete(validate(validators.deleteIssue), asyncHandler(Controllers.deleteIssue));

router.route('/board/:board').get(validate(validators.getIssues), asyncHandler(Controllers.getIssues));

router.route('/:id').get(validate(validators.getIssue), asyncHandler(Controllers.getIssue));

export default router;

