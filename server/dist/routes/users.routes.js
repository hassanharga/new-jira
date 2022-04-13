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
const Controllers = __importStar(require("../controllers/users.controller"));
const asyncHandler_1 = require("../utils/asyncHandler");
const validators = __importStar(require("../validations/users.validation"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get((0, asyncHandler_1.asyncHandler)(Controllers.getUsers))
    .post((0, express_validation_1.validate)(validators.addUser), (0, asyncHandler_1.asyncHandler)(Controllers.addUser))
    .put((0, express_validation_1.validate)(validators.updateUser), (0, asyncHandler_1.asyncHandler)(Controllers.updateUser))
    .delete((0, express_validation_1.validate)(validators.deleteUser), (0, asyncHandler_1.asyncHandler)(Controllers.deleteUser));
router.route('/:id').get((0, express_validation_1.validate)(validators.getUser), (0, asyncHandler_1.asyncHandler)(Controllers.getUser));
exports.default = router;
//# sourceMappingURL=users.routes.js.map