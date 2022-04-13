"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_routes_1 = __importDefault(require("./project.routes"));
const board_routes_1 = __importDefault(require("./board.routes"));
const issues_routes_1 = __importDefault(require("./issues.routes"));
const features_routes_1 = __importDefault(require("./features.routes"));
const testModules_routes_1 = __importDefault(require("./testModules.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const attachments_routes_1 = __importDefault(require("./attachments.routes"));
const router = (0, express_1.Router)();
router.use('/projects', project_routes_1.default);
router.use('/boards', board_routes_1.default);
router.use('/issues', issues_routes_1.default);
router.use('/features', features_routes_1.default);
router.use('/modules', testModules_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/attachments', attachments_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map