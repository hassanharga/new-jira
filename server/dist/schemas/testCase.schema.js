"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const testCaseSchema = new mongoose_1.Schema({
    attachments: { type: [String] },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.MODULES, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const IssueModel = (0, mongoose_1.model)(constants_1.tableNames.TEST_CASES, testCaseSchema);
exports.default = IssueModel;
//# sourceMappingURL=testCase.schema.js.map