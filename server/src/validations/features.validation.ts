import { Joi, schema } from 'express-validation';
import { Feature } from '../types/feature';

const messages = {
  'any.required': 'errorMsg.badCredentials',
  'string.empty': 'errorMsg.badCredentials',
  'string.base': 'errorMsg.badCredentials',
  'string.email': 'errorMsg.badCredentials',
  'any.only': 'errorMsg.badCredentials',
};

const bodyData = {
  name: Joi.string().empty().messages(messages),
  description: Joi.string().allow('').messages(messages),
  history: Joi.array().items(
    Joi.object({
      user: Joi.string().required().empty().messages(messages),
      description: Joi.string().required().empty().messages(messages),
    }),
  ),
  drafts: Joi.array().items(
    Joi.object({
      user: Joi.string().required().empty().messages(messages),
      description: Joi.string().required().empty().messages(messages),
    }),
  ),
};

export const addFeature: schema = {
  body: Joi.object<Feature>({
    project: Joi.string().required().empty().messages(messages),
    ...bodyData,
  }),
};

export const updateFeature: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
    draftId: Joi.string().empty().messages(messages),
    ...bodyData,
  }),
};

export const deleteFeature: schema = {
  body: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getFeature: schema = {
  params: Joi.object({
    id: Joi.string().required().empty().messages(messages),
  }),
};

export const getFeatures: schema = {
  query: Joi.object({
    project: Joi.string().empty().messages(messages),
  }).options({ allowUnknown: true }),
};
