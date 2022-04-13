"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = require("mongoose");
const validateObjectId = (id) => (0, mongoose_1.isValidObjectId)(id);
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validateObjectId.js.map