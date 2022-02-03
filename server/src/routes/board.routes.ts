import { Router } from 'express';
import { validate } from 'express-validation';
import * as Controllers from '../controllers/board.controller';
import { asyncHandler } from '../utils/asyncHandler';
import * as validators from '../validations/board.validation';

const router = Router();

router
  .route('/')
  .get(asyncHandler(Controllers.getBoards))
  .post(validate(validators.addBoard), asyncHandler(Controllers.addBoard))
  .put(validate(validators.updateBoard), asyncHandler(Controllers.updateBoard))
  .delete(validate(validators.deleteBoard), asyncHandler(Controllers.deleteBoard));

router.route('/:id').get(validate(validators.getBoard), asyncHandler(Controllers.getBoard));

export default router;
