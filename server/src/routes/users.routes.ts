import { Router } from 'express';
import { validate } from 'express-validation';
import * as Controllers from '../controllers/users.controller';
import { asyncHandler } from '../utils/asyncHandler';
import * as validators from '../validations/users.validation';

const router = Router();

router
  .route('/')
  .get(asyncHandler(Controllers.getUsers))
  .post(validate(validators.addUser), asyncHandler(Controllers.addUser))
  .put(validate(validators.updateUser), asyncHandler(Controllers.updateUser))
  .delete(validate(validators.deleteUser), asyncHandler(Controllers.deleteUser));

export default router;
