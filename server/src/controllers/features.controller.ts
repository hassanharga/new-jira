import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import { IssueStatus } from '../constants/issue';
import FeatureModel from '../schemas/feature.schema';
import IssueModel from '../schemas/issues.schema';
import ApiError from '../utils/ApiError';
import { signUrl } from '../utils/signUrl';

export const addFeature: RequestHandler = async (req, res) => {
  const feature = await FeatureModel.create(req.body);
  if (!feature) throw new ApiError('feature.notCreated', statusCodes.BAD_REQUEST);

  const history = feature.history.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  const drafts = feature.drafts.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  feature.history = history;
  feature.drafts = drafts;

  res.send(feature);
};

export const deleteFeature: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const feature = await FeatureModel.findById(id);
  if (!feature) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);
  await feature.remove();

  res.send(feature);
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
      const releaseData = await IssueModel.findById(feature.drafts[draftIdx].release);
      if (!releaseData) throw new ApiError('release.notFound', statusCodes.BAD_REQUEST);
      if (releaseData.status !== IssueStatus.done) throw new ApiError('release.opened', statusCodes.BAD_REQUEST);

      const draft = feature.drafts.splice(draftIdx, 1)[0];
      feature.history.push(draft);
    }
  }

  await feature.save();

  let updatedFeature = await FeatureModel.populate(feature, { path: 'drafts.user', select: 'name' });
  updatedFeature = await FeatureModel.populate(updatedFeature, { path: 'history.user', select: 'name' });
  updatedFeature = await FeatureModel.populate(updatedFeature, { path: 'drafts.release', select: 'version' });
  updatedFeature = await FeatureModel.populate(updatedFeature, { path: 'history.release', select: 'version' });

  const history = updatedFeature.history.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  const draftsData = updatedFeature.drafts.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  updatedFeature.history = history;
  updatedFeature.drafts = draftsData;

  res.send(updatedFeature);
};

export const getFeature: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const feature = await FeatureModel.findById(id)
    .populate('history.user', 'name')
    .populate('drafts.user', 'name')
    .populate('history.release', 'version')
    .populate('drafts.release', 'version');
  if (!feature) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);

  const history = feature.history.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  const drafts = feature.drafts.map((hist) => {
    const ele = hist;
    ele.attachments = ele.attachments.map((att) => signUrl(att));
    ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
    return ele;
  });

  feature.history = history;
  feature.drafts = drafts;

  res.send(feature);
};

export const getFeatures: RequestHandler = async (req, res) => {
  const { project } = req.query;
  if (!isValidObjectId(project)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  let features = await FeatureModel.find({ project })
    .populate('history.user', 'name')
    .populate('drafts.user', 'name')
    .populate('history.release', 'version')
    .populate('drafts.release', 'version');
  if (!features) throw new ApiError('feature.notFound', statusCodes.BAD_REQUEST);

  features = features.map((feat) => {
    const feature = feat;
    const history = feature.history.map((hist) => {
      const ele = hist;
      ele.attachments = ele.attachments.map((att) => signUrl(att));
      ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
      return ele;
    });

    const drafts = feature.drafts.map((hist) => {
      const ele = hist;
      ele.attachments = ele.attachments.map((att) => signUrl(att));
      ele.uxAttachments = ele.uxAttachments.map((att) => signUrl(att));
      return ele;
    });

    feature.history = history;
    feature.drafts = drafts;
    return feature;
  });

  res.send(features);
};

