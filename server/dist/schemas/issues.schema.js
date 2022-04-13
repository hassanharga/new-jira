"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const issue_1 = require("../constants/issue");
const issueSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    priority: { type: String, trim: true },
    key: { type: String, trim: true, unique: true },
    cbuNumber: { type: String, trim: true },
    version: { type: String },
    status: { type: String, enum: Object.values(issue_1.IssueStatus), default: issue_1.IssueStatus.design },
    type: { type: String, required: true, enum: Object.values(issue_1.IssueType) },
    components: { type: [String], enum: issue_1.IssueComponents },
    platform: { type: String, trim: true },
    description: { type: String, trim: true },
    assignee: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, trim: true },
    reporter: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, required: true, trim: true },
    labels: { type: [String] },
    attachments: { type: [String] },
    releaseId: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.ISSUES },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.MODULES },
    testCase: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.TEST_CASES },
    board: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.BOARDS, required: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.PROJECTS, required: true },
    comments: {
        type: [
            {
                user: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, required: true },
                comment: String,
                createdAt: { type: Date, default: new Date() },
                _id: false,
            },
        ],
    },
    sub: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: constants_1.tableNames.ISSUES,
    },
    linkedIssues: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: constants_1.tableNames.ISSUES,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
issueSchema.pre('remove', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.model(constants_1.tableNames.ISSUES).deleteMany({ releaseId: this._id });
    });
});
const IssueModel = (0, mongoose_1.model)(constants_1.tableNames.ISSUES, issueSchema);
exports.default = IssueModel;
//# sourceMappingURL=issues.schema.js.map