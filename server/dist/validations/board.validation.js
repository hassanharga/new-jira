"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoards = exports.getBoard = exports.deleteBoard = exports.updateBoard = exports.addBoard = void 0;
const express_validation_1 = require("express-validation");
const board_1 = require("../constants/board");
const messages = {
    'any.required': 'errorMsg.badCredentials',
    'string.empty': 'errorMsg.badCredentials',
    'string.base': 'errorMsg.badCredentials',
    'string.email': 'errorMsg.badCredentials',
    'any.only': 'errorMsg.badCredentials',
};
const bodyData = {
    name: express_validation_1.Joi.string()
        .required()
        .empty()
        .valid(...Object.keys(board_1.BoardNames))
        .messages(messages),
    type: express_validation_1.Joi.string()
        .required()
        .empty()
        .valid(...Object.keys(board_1.BoardTypes))
        .messages(messages),
    description: express_validation_1.Joi.string().empty().messages(messages),
    project: express_validation_1.Joi.string().required().empty().messages(messages),
};
exports.addBoard = {
    body: express_validation_1.Joi.object(Object.assign({}, bodyData)),
};
exports.updateBoard = {
    body: express_validation_1.Joi.object(Object.assign({ id: express_validation_1.Joi.string().required().empty().messages(messages) }, bodyData)),
};
exports.deleteBoard = {
    body: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getBoard = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required().empty().messages(messages),
    }),
};
exports.getBoards = {
    query: express_validation_1.Joi.object({
        project: express_validation_1.Joi.string().required().empty().messages(messages),
    }).options({ allowUnknown: true }),
};
//# sourceMappingURL=board.validation.js.map