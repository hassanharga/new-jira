"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const issueSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const IssueModel = (0, mongoose_1.model)(constants_1.tableNames.USERS, issueSchema);
exports.default = IssueModel;
//# sourceMappingURL=user.schema.js.map