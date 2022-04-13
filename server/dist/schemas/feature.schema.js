"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const issueSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.PROJECTS, required: true },
    history: [
        {
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, required: true },
            description: { type: String, trim: true },
            release: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.ISSUES },
            createdAt: { type: Date, default: new Date() },
            attachments: { type: [String] },
            uxAttachments: { type: [String] },
        },
    ],
    drafts: [
        {
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, required: true },
            description: { type: String, trim: true },
            release: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.ISSUES },
            createdAt: { type: Date, default: new Date() },
            attachments: { type: [String] },
            uxAttachments: { type: [String] },
        },
    ],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const IssueModel = (0, mongoose_1.model)(constants_1.tableNames.FEATURES, issueSchema);
exports.default = IssueModel;
//# sourceMappingURL=feature.schema.js.map