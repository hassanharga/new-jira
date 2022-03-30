import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import { IssueStatus, IssueType } from '../constants/issue';
import IssueModel, { IssueTableModel } from '../schemas/issues.schema';
import FeatureModel from '../schemas/feature.schema';
import ProjectModel from '../schemas/project.schema';
import ApiError from '../utils/ApiError';

export const addIssue: RequestHandler = async (req, res) => {
  const { project, releaseId, assignee, reporter, components, ...data } = req.body;

  const projectData = await ProjectModel.findById(project);
  if (!projectData) throw new ApiError('project.notFound', statusCodes.NOT_FOUND);

  if (!releaseId && !req.body.version) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  let mainIssue: IssueTableModel | null = null;
  if (releaseId) {
    if (!isValidObjectId(releaseId)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

    mainIssue = await IssueModel.findById(releaseId.toString());
    if (!mainIssue) throw new ApiError('issue.notCreated', statusCodes.BAD_REQUEST);

    data.board = mainIssue.board;
    data.releaseId = mainIssue._id;
    data.version = mainIssue.version;
  }

  if (assignee) data.assignee = assignee;
  if (reporter) data.reporter = reporter;
  if (components) data.components = components;

  const issuesCount = await IssueModel.countDocuments({ project, board: data.board });
  if (issuesCount < 0) throw new ApiError('issue.notCreated', statusCodes.BAD_REQUEST);

  data.key = `${projectData.key}-${issuesCount + 1}`;

  const issue = await IssueModel.create({ ...data, project });
  if (!issue) throw new ApiError('issue.notCreated', statusCodes.BAD_REQUEST);

  if (mainIssue) {
    mainIssue.sub.push(issue._id);
    await mainIssue.save();
  }

  let sentIssue = await IssueModel.populate(issue, { path: 'reporter', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'assignee', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'sub', select: 'name' });

  res.send(sentIssue);
};

export const deleteIssue: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const issue = await IssueModel.findById(id);
  if (!issue) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);
  await issue.remove();

  res.send(issue);
};

export const updateIssue: RequestHandler = async (req, res) => {
  const {
    id,
    releaseId,
    name,
    priority,
    version,
    assignee,
    reporter,
    description,
    labels,
    comments,
    status,
    type,
    components,
  } = req.body;

  if (releaseId && !isValidObjectId(releaseId)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const issue = await IssueModel.findById(id);
  if (!issue) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  if (priority) issue.priority = priority;
  if (name) issue.name = name;
  if (version) issue.version = version;
  if (assignee) issue.assignee = assignee;
  if (reporter) issue.reporter = reporter;
  if (description) issue.description = description;
  if (labels) issue.labels = labels;
  if (status) issue.status = status;
  if (type) issue.type = type;
  if (components) issue.components = components;
  if (comments) issue.comments = [...issue.comments, ...comments];

  await issue.save();

  // publish features draft changes
  if (status === IssueStatus.done && issue.type === IssueType.release) {
    const features = await FeatureModel.find({ 'drafts.release': issue._id });
    for (const feature of features) {
      const draftIdx = feature.drafts.findIndex((ele) => ele.release.toString() === issue._id.toString());
      if (draftIdx >= 0) {
        const draft = feature.drafts.splice(draftIdx, 1)[0];
        feature.history.push(draft);
        await feature.save();
      }
    }
  }

  let sentIssue = await IssueModel.populate(issue, { path: 'reporter', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'assignee', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'sub', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'comments.user', select: 'name' });

  res.send(sentIssue);
};

export const getIssue: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const issue = await IssueModel.findById(id)
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name')
    .populate('comments.user', 'name');

  if (!issue) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  res.send(issue);
};

export const getIssues: RequestHandler = async (req, res) => {
  const { board } = req.params;

  if (!isValidObjectId(board)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const { status, type, search = '' } = req.query;

  const query: Record<string, any> = {
    board,
  };

  if (search) query.name = { $regex: search, $options: 'i' };

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = IssueType.release;
  }

  const issues = await IssueModel.find({ ...query })
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name')
    .populate('comments.user', 'name');
  if (!issues) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  res.send(issues);
};

