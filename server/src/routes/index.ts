import { Router } from 'express';
import projectRouters from './project.routes';
import boardRouters from './board.routes';
import issuesRouters from './issues.routes';
import featuresRouters from './features.routes';
import usersRouters from './users.routes';
import attachmentsRouters from './attachments.routes';

const router = Router();

router.use('/projects', projectRouters);
router.use('/boards', boardRouters);
router.use('/issues', issuesRouters);
router.use('/features', featuresRouters);
router.use('/users', usersRouters);
router.use('/attachments', attachmentsRouters);

export default router;
