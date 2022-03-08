import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import IssueModel, { IssueTableModel } from '../schemas/issues.schema';
import ApiError from '../utils/ApiError';

export const addIssue: RequestHandler = async (req, res) => {
  const { releaseId, assignee, reporter, components, ...data } = req.body;

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

  const issue = await IssueModel.create(data);
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

  let sentIssue = await IssueModel.populate(issue, { path: 'reporter', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'assignee', select: 'name' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'sub', select: 'name' });

  res.send(sentIssue);
};

export const getIssue: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const issue = await IssueModel.findById(id)
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name');
  if (!issue) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  res.send(issue);
};

export const getIssues: RequestHandler = async (req, res) => {
  const { board } = req.params;
  const { status, type } = req.query;

  const query: Record<string, any> = {
    board,
  };

  if (status) {
    query.status = status;
  }
  if (type) {
    query.type = 'release';
  }

  const issues = await IssueModel.find({ ...query })
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name');
  if (!issues) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  res.send(issues);
};
