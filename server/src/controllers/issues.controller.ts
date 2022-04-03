import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import { IssueStatus, IssueType } from '../constants/issue';
import IssueModel, { IssueTableModel } from '../schemas/issues.schema';
import FeatureModel from '../schemas/feature.schema';
import TestCaseModel from '../schemas/testCase.schema';
import ProjectModel from '../schemas/project.schema';
import ApiError from '../utils/ApiError';
import { signUrl } from '../utils/signUrl';
import { BoardNames } from '../constants/board';
import BoardModel from '../schemas/board.schema';
import { TestCase } from '../types/testCase';

export const addIssue: RequestHandler = async (req, res) => {
  const { project, releaseId, assignee, reporter, components, ...data } = req.body;

  const projectData = await ProjectModel.findById(project);
  if (!projectData) throw new ApiError('project.notFound', statusCodes.NOT_FOUND);

  // if (!releaseId && !req.body.version) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

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

  const issuesCount = await IssueModel.countDocuments({ project });
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
  sentIssue = await IssueModel.populate(sentIssue, { path: 'testCase' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'module' });

  sentIssue.attachments = sentIssue.attachments.map((ele) => signUrl(ele));

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
  sentIssue = await IssueModel.populate(sentIssue, { path: 'testCase' });
  sentIssue = await IssueModel.populate(sentIssue, { path: 'module' });

  sentIssue.attachments = sentIssue.attachments.map((ele) => signUrl(ele));

  if (sentIssue.testCase && typeof sentIssue.testCase === 'object') {
    const testCase = sentIssue.testCase as TestCase;
    testCase.attachments = testCase.attachments.map((att) => signUrl(att));
    sentIssue.testCase = testCase;
  }

  res.send(sentIssue);
};

export const getIssue: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const issue = await IssueModel.findById(id)
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name')
    .populate('comments.user', 'name')
    .populate('module')
    .populate('testCase');

  if (!issue) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  issue.attachments = issue.attachments.map((ele) => signUrl(ele));

  if (issue.testCase && typeof issue.testCase === 'object') {
    const testCase = issue.testCase as TestCase;
    testCase.attachments = testCase.attachments.map((att) => signUrl(att));
    issue.testCase = testCase;
  }

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
    query.type = type;
  }

  let issues = await IssueModel.find({ ...query })
    .populate('reporter', 'name')
    .populate('assignee', 'name')
    .populate('sub', 'name')
    .populate('comments.user', 'name')
    .populate('module')
    .populate('testCase');
  if (!issues) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  issues = issues.map((ele) => {
    const issue = ele;
    issue.attachments = issue.attachments.map((att) => signUrl(att));
    if (issue.testCase && typeof issue.testCase === 'object') {
      const testCase = issue.testCase as TestCase;
      testCase.attachments = testCase.attachments.map((att) => signUrl(att));
      issue.testCase = testCase;
    }

    return issue;
  });

  res.send(issues);
};

export const addTestIssue: RequestHandler = async (req, res) => {
  const { project, board, assignee, modules, ...data } = req.body;

  const projectData = await ProjectModel.findById(project);
  if (!projectData) throw new ApiError('project.notFound', statusCodes.NOT_FOUND);

  const boardData = await BoardModel.findById(board);
  if (!boardData || boardData.name !== BoardNames.Test) throw new ApiError('board.notFound', statusCodes.NOT_FOUND);

  const issuesCount = await IssueModel.countDocuments({ project });
  if (issuesCount < 0) throw new ApiError('issue.notFound', statusCodes.BAD_REQUEST);

  data.key = `${projectData.key}-${issuesCount + 1}`;

  const modulesTestCases = await TestCaseModel.find({ module: { $in: modules } });
  if (!modulesTestCases) throw new ApiError('testCase.notFound', statusCodes.NOT_FOUND);

  const issuesTobeCreated = modulesTestCases.map((ele, idx) => {
    const payload = {
      ...data,
      name: ele.name,
      project,
      board,
      module: ele.module,
      testCase: ele._id,
      status: IssueStatus.todo,
      key: `${projectData.key}-${issuesCount + idx + 1}`,
    };

    if (assignee) payload.assignee = assignee;
    return payload;
  });

  const issues = await IssueModel.insertMany(issuesTobeCreated);
  if (!issues) throw new ApiError('testCase.notFound', statusCodes.BAD_REQUEST);

  res.json(issues);
};

