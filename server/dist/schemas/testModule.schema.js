"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const testModuleSchema = new mongoose_1.Schema({
    testCases: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: constants_1.tableNames.TEST_CASES,
    },
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.PROJECTS, required: true },
    release: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.ISSUES, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const IssueModel = (0, mongoose_1.model)(constants_1.tableNames.MODULES, testModuleSchema);
exports.default = IssueModel;
//# sourceMappingURL=testModule.schema.js.map