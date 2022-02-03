import { Router } from 'express';
import projectRouters from './project.routes';
import boardRouters from './board.routes';
import issuesRouters from './issues.routes';

const router = Router();

router.use('/projects', projectRouters);
router.use('/boards', boardRouters);
router.use('/issues', issuesRouters);

export default router;
