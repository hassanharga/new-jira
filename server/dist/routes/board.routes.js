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
const Controllers = __importStar(require("../controllers/board.controller"));
const asyncHandler_1 = require("../utils/asyncHandler");
const validators = __importStar(require("../validations/board.validation"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get((0, express_validation_1.validate)(validators.getBoards), (0, asyncHandler_1.asyncHandler)(Controllers.getBoards))
    .post((0, express_validation_1.validate)(validators.addBoard), (0, asyncHandler_1.asyncHandler)(Controllers.addBoard))
    .put((0, express_validation_1.validate)(validators.updateBoard), (0, asyncHandler_1.asyncHandler)(Controllers.updateBoard))
    .delete((0, express_validation_1.validate)(validators.deleteBoard), (0, asyncHandler_1.asyncHandler)(Controllers.deleteBoard));
router.route('/:id').get((0, express_validation_1.validate)(validators.getBoard), (0, asyncHandler_1.asyncHandler)(Controllers.getBoard));
exports.default = router;
//# sourceMappingURL=board.routes.js.map