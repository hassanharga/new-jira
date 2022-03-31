import { Router } from 'express';
import * as Controllers from '../controllers/testModules.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router
  .route('/')
  .get(asyncHandler(Controllers.getTestModules))
  .post(asyncHandler(Controllers.addTestModule))
  .delete(asyncHandler(Controllers.deleteTestModule));

router.route('/:module/testCase').post(asyncHandler(Controllers.addTestCase));

export default router;

