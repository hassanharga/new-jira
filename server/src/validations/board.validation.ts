import { Joi, schema } from 'express-validation';
import { BoardNames, BoardTypes } from '../constants/board';
import { Board } from '../types/board';

const messages = {
  'any.required': 'errorMsg.badCredentials',
  'string.empty': 'errorMsg.badCredentials',
  'string.base': 'errorMsg.badCredentials',
  'string.email': 'errorMsg.badCredentials',
  'any.only': 'errorMsg.badCredentials',
};

const bodyData = {
  name: Joi.string()
    .required()
    .empty()
    .valid(...Object.keys(BoardNames))
    .messages(messages),
  type: Joi.string()
    .required()
    .empty()
    .valid(...Object.keys(BoardTypes))
    .messages(messages),
  description: Joi.string().empty().messages(messages),
  project: Joi.string().required().empty().messages(messages),
};

export const addBoard: schema = {
  body: Joi.object<Board>({
    ...bodyData,
  }),
};

export const updateBoard: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
    ...bodyData,
  }),
};

export const deleteBoard: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getBoard: schema = {
  params: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getBoards: schema = {
  query: Joi.object({
    project: Joi.string().required().empty().messages(messages),
  }).options({ allowUnknown: true }),
};
