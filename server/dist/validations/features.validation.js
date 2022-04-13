"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatures = exports.getFeature = exports.deleteFeature = exports.updateFeature = exports.addFeature = void 0;
const express_validation_1 = require("express-validation");
const messages = {
    'any.required': 'errorMsg.badCredentials',
    'string.empty': 'errorMsg.badCredentials',
    'string.base': 'errorMsg.badCredentials',
    'string.email': 'errorMsg.badCredentials',
    'any.only': 'errorMsg.badCredentials',
};
const bodyData = {
    name: express_validation_1.Joi.string().empty().messages(messages),
    description: express_validation_1.Joi.string().allow('').messages(messages),
    history: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
        user: express_validation_1.Joi.string().required().empty().messages(messages),
        description: express_validation_1.Joi.string().required().empty().messages(messages),
        release: express_validation_1.Joi.string().required().empty().messages(messages),
        attachments: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
        uxAttachments: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
    })),
    drafts: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
        user: express_validation_1.Joi.string().required().empty().messages(messages),
        description: express_validation_1.Joi.string().required().empty().messages(messages),
        release: express_validation_1.Joi.string().required().empty().messages(messages),
        attachments: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
        uxAttachments: express_validation_1.Joi.array().items(express_validation_1.Joi.string()).messages(messages),
    })),
};
exports.addFeature = {
    body: express_validation_1.Joi.object(Object.assign({ project: express_validation_1.Joi.string().required().empty().messages(messages) }, bodyData)),
};
exports.updateFeature = {
    body: express_validation_1.Joi.object(Object.assign({ id: express_validation_1.Joi.string().required().empty().messages(messages), draftId: express_validation_1.Joi.string().empty().messages(messages) }, bodyData)),
};
exports.deleteFeature = {
    body: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getFeature = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getFeatures = {
    query: express_validation_1.Joi.object({
        project: express_validation_1.Joi.string().empty().messages(messages),
    }).options({ allowUnknown: true }),
};
//# sourceMappingURL=features.validation.js.map