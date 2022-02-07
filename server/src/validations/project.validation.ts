import { Joi, schema } from 'express-validation';
import { ProjectType } from '../constants/project';
import { Project } from '../types/project';

const messages = {
  'any.required': 'errorMsg.badCredentials',
  'string.empty': 'errorMsg.badCredentials',
  'string.base': 'errorMsg.badCredentials',
  'string.email': 'errorMsg.badCredentials',
  'any.only': 'errorMsg.badCredentials',
};

const bodyData = {
  name: Joi.string().required().empty().messages(messages),
  description: Joi.string().empty().messages(messages),
  key: Joi.string().required().empty().messages(messages),
  type: Joi.string()
    .empty()
    .valid(...Object.keys(ProjectType))
    .messages(messages),
  lead: Joi.string().required().empty().messages(messages),
};

export const addProject: schema = {
  body: Joi.object<Project>({
    ...bodyData,
  }),
};

export const updateProject: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
    ...bodyData,
  }),
};

export const deleteProject: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getProject: schema = {
  params: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};
export const getProjects: schema = {
  query: Joi.object({
    search: Joi.string().empty().messages(messages),
  }).options({ allowUnknown: true }),
};
