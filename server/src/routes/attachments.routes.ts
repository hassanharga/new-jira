import { Router } from 'express';
import * as Controllers from '../controllers/attachments.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.route('/').get(asyncHandler(Controllers.createPreSignedUrl));

router.route('/signUrl').get(asyncHandler(Controllers.signUrl));

export default router;

