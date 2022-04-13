"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validation_1 = require("express-validation");
const Controllers = __importStar(require("../controllers/project.controller"));
const asyncHandler_1 = require("../utils/asyncHandler");
const validators = __importStar(require("../validations/project.validation"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get((0, express_validation_1.validate)(validators.getProjects), (0, asyncHandler_1.asyncHandler)(Controllers.getProjects))
    .post((0, express_validation_1.validate)(validators.addProject), (0, asyncHandler_1.asyncHandler)(Controllers.addProject))
    .put((0, express_validation_1.validate)(validators.updateProject), (0, asyncHandler_1.asyncHandler)(Controllers.updateProject))
    .delete((0, express_validation_1.validate)(validators.deleteProject), (0, asyncHandler_1.asyncHandler)(Controllers.deleteProject));
router.route('/:id').get((0, express_validation_1.validate)(validators.getProject), (0, asyncHandler_1.asyncHandler)(Controllers.getProject));
exports.default = router;
//# sourceMappingURL=project.routes.js.map