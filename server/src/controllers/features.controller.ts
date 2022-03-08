import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import FeatureModel from '../schemas/feature.schema';
import ApiError from '../utils/ApiError';

export const addFeature: RequestHandler = async (req, res) => {
  const feature = await FeatureModel.create(req.body);
  if (!feature) throw new ApiError('feature.notCreated', statusCodes.BAD_REQUEST);

  res.send(feature);
};

export const deleteFeature: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const feature = await FeatureModel.findById(id);
  if (!feature) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);
  await feature.remove();

  let updatedFeature = await FeatureModel.populate(feature, { path: 'draft.user', select: 'name' });
  updatedFeature = await FeatureModel.populate(updatedFeature, { path: 'history.user', select: 'name' });

  res.send(updatedFeature);
};

export const updateFeature: RequestHandler = async (req, res) => {
  const { id, name, description, drafts, draftId } = req.body;

  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const feature = await FeatureModel.findById(id);
  if (!feature) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);

  if (name) feature.name = name;
  if (description) feature.description = description;
  if (drafts && drafts.length > 0) feature.drafts.push(drafts[0]);
  if (draftId) {
    const draftIdx = feature.drafts.findIndex((ele) => ele._id.toString() === draftId.toString());
    if (draftIdx >= 0) {
      const draft = feature.drafts.splice(draftIdx, 1)[0];
      feature.history.push(draft);
    }
  }

  await feature.save();

  let updatedFeature = await FeatureModel.populate(feature, { path: 'draft.user', select: 'name' });
  updatedFeature = await FeatureModel.populate(updatedFeature, { path: 'history.user', select: 'name' });

  res.send(updatedFeature);
};

export const getFeature: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const feature = await FeatureModel.findById(id).populate('history.user', 'name').populate('drafts.user', 'name');
  if (!feature) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);

  res.send(feature);
};

export const getFeatures: RequestHandler = async (req, res) => {
  const { project } = req.query;
  if (!isValidObjectId(project)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const features = await FeatureModel.find({ project })
    .populate('history.user', 'name')
    .populate('drafts.user', 'name');
  if (!features) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);

  res.send(features);
};
