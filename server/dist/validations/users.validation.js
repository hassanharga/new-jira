"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.deleteUser = exports.updateUser = exports.addUser = void 0;
const express_validation_1 = require("express-validation");
const messages = {
    'any.required': 'errorMsg.badCredentials',
    'string.empty': 'errorMsg.badCredentials',
    'string.base': 'errorMsg.badCredentials',
    'string.email': 'errorMsg.badCredentials',
    'any.only': 'errorMsg.badCredentials',
};
const bodyData = {
    name: express_validation_1.Joi.string().required().empty().messages(messages),
    email: express_validation_1.Joi.string().required().email().empty().messages(messages),
    username: express_validation_1.Joi.string().required().empty().messages(messages),
};
exports.addUser = {
    body: express_validation_1.Joi.object(Object.assign({}, bodyData)),
};
exports.updateUser = {
    body: express_validation_1.Joi.object(Object.assign({ id: express_validation_1.Joi.string().required().empty().messages(messages) }, bodyData)),
};
exports.deleteUser = {
    body: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getUser = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getUsers = {
    query: express_validation_1.Joi.object({
        project: express_validation_1.Joi.string().empty().messages(messages),
        search: express_validation_1.Joi.string().empty().messages(messages),
    }).options({ allowUnknown: true }),
};
//# sourceMappingURL=users.validation.js.map