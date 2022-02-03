import { Joi, schema } from 'express-validation';
import { IssueComponents, IssueStatus, IssueType } from '../constants/issue';
import { Issue } from '../types/issue';

const messages = {
  'any.required': 'errorMsg.badCredentials',
  'string.empty': 'errorMsg.badCredentials',
  'string.base': 'errorMsg.badCredentials',
  'string.email': 'errorMsg.badCredentials',
  'any.only': 'errorMsg.badCredentials',
};

const bodyData = {
  name: Joi.string().required().empty().messages(messages),
  version: Joi.string().allow('').messages(messages),
  assignee: Joi.string().empty().messages(messages),
  board: Joi.string().required().hex().empty().messages(messages),
  releaseId: Joi.string().allow('').messages(messages),
  reporter: Joi.string().required().empty().messages(messages),
  description: Joi.string().empty().messages(messages),
  labels: Joi.array().items(Joi.string()).messages(messages),
  comments: Joi.array()
    .items(
      Joi.object({
        user: Joi.string().required().empty().messages(messages),
        comment: Joi.string().required().empty().messages(messages),
      }),
    )
    .messages(messages),
  status: Joi.string()
    .empty()
    .valid(...Object.keys(IssueStatus))
    .messages(messages),
  type: Joi.string()
    .required()
    .empty()
    .valid(...Object.keys(IssueType))
    .messages(messages),
  components: Joi.array()
    .items(Joi.string().valid(...Object.keys(IssueComponents)))
    .messages(messages),
};

export const addIssue: schema = {
  body: Joi.object<Issue>({
    ...bodyData,
  }),
};

export const updateIssue: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
    ...bodyData,
  }),
};

export const deleteIssue: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getIssue: schema = {
  params: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getIssues: schema = {
  params: Joi.object({
    board: Joi.string().empty().messages(messages),
  }),
  query: Joi.object({
    status: Joi.string()
      .empty()
      .valid(...Object.keys(IssueStatus))
      .messages(messages),
  }),
};
