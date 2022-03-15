import { Joi, schema } from 'express-validation';
import { User } from '../types/user';

const messages = {
  'any.required': 'errorMsg.badCredentials',
  'string.empty': 'errorMsg.badCredentials',
  'string.base': 'errorMsg.badCredentials',
  'string.email': 'errorMsg.badCredentials',
  'any.only': 'errorMsg.badCredentials',
};

const bodyData = {
  name: Joi.string().required().empty().messages(messages),
  email: Joi.string().required().email().empty().messages(messages),
  username: Joi.string().required().empty().messages(messages),
};

export const addUser: schema = {
  body: Joi.object<User>({
    ...bodyData,
  }),
};

export const updateUser: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
    ...bodyData,
  }),
};

export const deleteUser: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getUser: schema = {
  params: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getUsers: schema = {
  query: Joi.object({
    project: Joi.string().empty().messages(messages),
    search: Joi.string().empty().messages(messages),
  }).options({ allowUnknown: true }),
};
