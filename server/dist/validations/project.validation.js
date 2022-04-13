"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = exports.getProject = exports.deleteProject = exports.updateProject = exports.addProject = void 0;
const express_validation_1 = require("express-validation");
const project_1 = require("../constants/project");
const messages = {
    'any.required': 'errorMsg.badCredentials',
    'string.empty': 'errorMsg.badCredentials',
    'string.base': 'errorMsg.badCredentials',
    'string.email': 'errorMsg.badCredentials',
    'any.only': 'errorMsg.badCredentials',
};
const bodyData = {
    name: express_validation_1.Joi.string().required().empty().messages(messages),
    description: express_validation_1.Joi.string().empty().messages(messages),
    key: express_validation_1.Joi.string().required().empty().messages(messages),
    type: express_validation_1.Joi.string()
        .empty()
        .valid(...Object.keys(project_1.ProjectType))
        .messages(messages),
    lead: express_validation_1.Joi.string().required().empty().messages(messages),
};
exports.addProject = {
    body: express_validation_1.Joi.object(Object.assign({}, bodyData)),
};
exports.updateProject = {
    body: express_validation_1.Joi.object(Object.assign({ id: express_validation_1.Joi.string().required().empty().messages(messages) }, bodyData)),
};
exports.deleteProject = {
    body: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getProject = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getProjects = {
    query: express_validation_1.Joi.object({
        search: express_validation_1.Joi.string().empty().messages(messages),
    }).options({ allowUnknown: true }),
};
//# sourceMappingURL=project.validation.js.map