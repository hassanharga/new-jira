"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchIssues = exports.getIssues = exports.getIssue = exports.deleteIssue = exports.updateIssue = exports.createBugIssue = exports.addIssue = void 0;
const express_validation_1 = require("express-validation");
const issue_1 = require("../constants/issue");
const messages = {
    'any.required': 'errorMsg.badCredentials',
    'string.empty': 'errorMsg.badCredentials',
    'string.base': 'errorMsg.badCredentials',
    'string.email': 'errorMsg.badCredentials',
    'any.only': 'errorMsg.badCredentials',
};
const bodyData = {
    name: express_validation_1.Joi.string().empty().messages(messages),
    priority: express_validation_1.Joi.string().empty().messages(messages),
    version: express_validation_1.Joi.string().allow('').messages(messages),
    assignee: express_validation_1.Joi.string().allow('').messages(messages),
    board: express_validation_1.Joi.string().empty().messages(messages),
    project: express_validation_1.Joi.string().hex().empty().messages(messages),
    releaseId: express_validation_1.Joi.string().allow('').messages(messages),
    reporter: express_validation_1.Joi.string().empty().messages(messages),
    cbuNumber: express_validation_1.Joi.string().allow('').messages(messages),
    description: express_validation_1.Joi.string().allow('').messages(messages),
    platform: express_validation_1.Joi.string().allow('').messages(messages),
    attachments: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
    modules: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
    labels: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
    comments: express_validation_1.Joi.array()
        .items(express_validation_1.Joi.object({
        user: express_validation_1.Joi.string().empty().messages(messages),
        comment: express_validation_1.Joi.string().empty().messages(messages),
    }))
        .messages(messages),
    status: express_validation_1.Joi.string()
        .empty()
        .valid(...Object.keys(issue_1.IssueStatus))
        .messages(messages),
    type: express_validation_1.Joi.string()
        .empty()
        .valid(...Object.keys(issue_1.IssueType))
        .messages(messages),
    components: express_validation_1.Joi.array()
        .items(express_validation_1.Joi.string().valid(...Object.keys(issue_1.IssueComponents)))
        .messages(messages),
    linkedIssues: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
};
exports.addIssue = {
    body: express_validation_1.Joi.object(Object.assign({ createdByTestCase: express_validation_1.Joi.boolean().messages(messages), testCase: express_validation_1.Joi.string().messages(messages) }, bodyData)),
};
exports.createBugIssue = {
    body: express_validation_1.Joi.object({
        testCaseId: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.updateIssue = {
    body: express_validation_1.Joi.object(Object.assign({ id: express_validation_1.Joi.string().required().empty().messages(messages), isTestIssue: express_validation_1.Joi.boolean().empty().messages(messages) }, bodyData)),
};
exports.deleteIssue = {
    body: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getIssue = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getIssues = {
    params: express_validation_1.Joi.object({
        board: express_validation_1.Joi.string().empty().messages(messages),
    }),
    query: express_validation_1.Joi.object({
        search: express_validation_1.Joi.string().empty().messages(messages),
        status: express_validation_1.Joi.string()
            .empty()
            .valid(...Object.keys(issue_1.IssueStatus))
            .messages(messages),
    }).options({ allowUnknown: true }),
};
exports.searchIssues = {
    params: express_validation_1.Joi.object({
        project: express_validation_1.Joi.string().empty().messages(messages),
    }),
    query: express_validation_1.Joi.object({
        search: express_validation_1.Joi.string().allow('').messages(messages),
    }).options({ allowUnknown: true }),
};
//# sourceMappingURL=issues.validation.js.map