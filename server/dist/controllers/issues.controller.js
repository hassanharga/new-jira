"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBugIssue = exports.addTestIssue = exports.searchIssues = exports.getIssues = exports.getIssue = exports.updateIssue = exports.deleteIssue = exports.addIssue = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const issue_1 = require("../constants/issue");
const issues_schema_1 = __importDefault(require("../schemas/issues.schema"));
const feature_schema_1 = __importDefault(require("../schemas/feature.schema"));
const testCase_schema_1 = __importDefault(require("../schemas/testCase.schema"));
const project_schema_1 = __importDefault(require("../schemas/project.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const signUrl_1 = require("../utils/signUrl");
const board_1 = require("../constants/board");
const board_schema_1 = __importDefault(require("../schemas/board.schema"));
const addIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { createdByTestCase, board, project, releaseId, assignee, reporter, components } = _a, data = __rest(_a, ["createdByTestCase", "board", "project", "releaseId", "assignee", "reporter", "components"]);
    const projectData = yield project_schema_1.default.findById(project);
    if (!projectData)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.NOT_FOUND);
    let mainIssue = null;
    if (releaseId) {
        if (!(0, mongoose_1.isValidObjectId)(releaseId))
            throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
        mainIssue = yield issues_schema_1.default.findById(releaseId.toString());
        if (!mainIssue)
            throw new ApiError_1.default('issue.notCreated', http_status_codes_1.default.BAD_REQUEST);
        data.board = mainIssue.board;
        data.releaseId = mainIssue._id;
        data.version = mainIssue.version;
    }
    else if (createdByTestCase) {
        const boardData = yield board_schema_1.default.findOne({ name: board, project });
        if (!board)
            throw new ApiError_1.default('project.notFound', http_status_codes_1.default.NOT_FOUND);
        data.board = boardData === null || boardData === void 0 ? void 0 : boardData._id;
    }
    else {
        data.board = board;
    }
    if (assignee)
        data.assignee = assignee;
    if (reporter)
        data.reporter = reporter;
    if (components)
        data.components = components;
    const issuesCount = yield issues_schema_1.default.countDocuments({ project });
    if (issuesCount < 0)
        throw new ApiError_1.default('issue.notCreated', http_status_codes_1.default.BAD_REQUEST);
    data.key = `${projectData.key}-${issuesCount + 1}`;
    const issue = yield issues_schema_1.default.create(Object.assign(Object.assign({}, data), { project }));
    if (!issue)
        throw new ApiError_1.default('issue.notCreated', http_status_codes_1.default.BAD_REQUEST);
    if (mainIssue) {
        mainIssue.sub.push(issue._id);
        yield mainIssue.save();
    }
    let sentIssue = yield issues_schema_1.default.populate(issue, { path: 'reporter', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'assignee', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'sub', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'testCase' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'module' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'linkedIssues' });
    sentIssue.attachments = sentIssue.attachments.map((ele) => (0, signUrl_1.signUrl)(ele));
    res.send(sentIssue);
});
exports.addIssue = addIssue;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const issue = yield issues_schema_1.default.findById(id);
    if (!issue)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield issue.remove();
    res.send(issue);
});
exports.deleteIssue = deleteIssue;
const updateIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, releaseId, name, priority, version, assignee, reporter, description, labels, comments, status, type, components, isTestIssue, } = req.body;
    if (releaseId && !(0, mongoose_1.isValidObjectId)(releaseId))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const issue = yield issues_schema_1.default.findById(id);
    if (!issue)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    if (priority)
        issue.priority = priority;
    if (name)
        issue.name = name;
    if (version)
        issue.version = version;
    if (assignee)
        issue.assignee = assignee;
    if (reporter)
        issue.reporter = reporter;
    if (description) {
        if (isTestIssue) {
            const testCase = yield testCase_schema_1.default.findById(issue.testCase);
            if (testCase) {
                testCase.description = description;
                yield testCase.save();
            }
        }
        else {
            issue.description = description;
        }
    }
    if (labels)
        issue.labels = labels;
    if (status)
        issue.status = status;
    if (type)
        issue.type = type;
    if (components)
        issue.components = components;
    if (comments)
        issue.comments = [...issue.comments, ...comments];
    yield issue.save();
    if (status === issue_1.IssueStatus.done && issue.type === issue_1.IssueType.release) {
        const features = yield feature_schema_1.default.find({ 'drafts.release': issue._id });
        for (const feature of features) {
            const draftIdx = feature.drafts.findIndex((ele) => ele.release.toString() === issue._id.toString());
            if (draftIdx >= 0) {
                const draft = feature.drafts.splice(draftIdx, 1)[0];
                feature.history.push(draft);
                yield feature.save();
            }
        }
    }
    let sentIssue = yield issues_schema_1.default.populate(issue, { path: 'reporter', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'assignee', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'sub', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'comments.user', select: 'name' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'testCase' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'module' });
    sentIssue = yield issues_schema_1.default.populate(sentIssue, { path: 'linkedIssues' });
    sentIssue.attachments = sentIssue.attachments.map((ele) => (0, signUrl_1.signUrl)(ele));
    if (sentIssue.testCase && typeof sentIssue.testCase === 'object') {
        const testCase = sentIssue.testCase;
        testCase.attachments = testCase.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        sentIssue.testCase = testCase;
    }
    res.send(sentIssue);
});
exports.updateIssue = updateIssue;
const getIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const issue = yield issues_schema_1.default.findById(id)
        .populate('reporter', 'name')
        .populate('assignee', 'name')
        .populate('sub', 'name')
        .populate('comments.user', 'name')
        .populate('linkedIssues')
        .populate('module')
        .populate('testCase');
    if (!issue)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    issue.attachments = issue.attachments.map((ele) => (0, signUrl_1.signUrl)(ele));
    if (issue.testCase && typeof issue.testCase === 'object') {
        const testCase = issue.testCase;
        testCase.attachments = testCase.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        issue.testCase = testCase;
    }
    res.send(issue);
});
exports.getIssue = getIssue;
const getIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { board } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(board))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const { status, type, search = '' } = req.query;
    const query = {
        board,
    };
    if (search)
        query.name = { $regex: search, $options: 'i' };
    if (status) {
        query.status = status;
    }
    if (type) {
        query.type = type;
    }
    let issues = yield issues_schema_1.default.find(Object.assign({}, query))
        .populate('reporter', 'name')
        .populate('assignee', 'name')
        .populate('sub', 'name')
        .populate('comments.user', 'name')
        .populate('linkedIssues')
        .populate({
        path: 'module',
        populate: {
            path: 'release',
            select: 'version name',
        },
    })
        .populate('testCase');
    if (!issues)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    issues = issues.map((ele) => {
        const issue = ele;
        issue.attachments = issue.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        if (issue.testCase && typeof issue.testCase === 'object') {
            const testCase = issue.testCase;
            testCase.attachments = testCase.attachments.map((att) => (0, signUrl_1.signUrl)(att));
            issue.testCase = testCase;
        }
        return issue;
    });
    res.send(issues);
});
exports.getIssues = getIssues;
const searchIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(project))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const { search = '', allBoards = false } = req.query;
    const query = {
        project,
    };
    if (search)
        query.name = { $regex: search, $options: 'i' };
    if (allBoards)
        query.type = issue_1.IssueType.release;
    const issues = yield issues_schema_1.default.find(Object.assign({}, query));
    if (!issues)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(issues);
});
exports.searchIssues = searchIssues;
const addTestIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = req.body, { project, board, assignee, modules } = _b, data = __rest(_b, ["project", "board", "assignee", "modules"]);
    const projectData = yield project_schema_1.default.findById(project);
    if (!projectData)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.NOT_FOUND);
    const boardData = yield board_schema_1.default.findById(board);
    if (!boardData || boardData.name !== board_1.BoardNames.Test)
        throw new ApiError_1.default('board.notFound', http_status_codes_1.default.NOT_FOUND);
    const issuesCount = yield issues_schema_1.default.countDocuments({ project });
    if (issuesCount < 0)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    data.key = `${projectData.key}-${issuesCount + 1}`;
    const modulesTestCases = yield testCase_schema_1.default.find({ module: { $in: modules } });
    if (!modulesTestCases)
        throw new ApiError_1.default('testCase.notFound', http_status_codes_1.default.NOT_FOUND);
    const issuesTobeCreated = modulesTestCases.map((ele, idx) => {
        const payload = Object.assign(Object.assign({}, data), { name: ele.name, project,
            board, module: ele.module, testCase: ele._id, status: issue_1.IssueStatus.todo, key: `${projectData.key}-${issuesCount + idx + 1}` });
        if (assignee)
            payload.assignee = assignee;
        return payload;
    });
    const issues = yield issues_schema_1.default.insertMany(issuesTobeCreated);
    if (!issues)
        throw new ApiError_1.default('testCase.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.json(issues);
});
exports.addTestIssue = addTestIssue;
const createBugIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { testCaseId } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(testCaseId))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const testCase = yield issues_schema_1.default.findById(testCaseId);
    if (!testCase || testCase.type !== issue_1.IssueType.test)
        throw new ApiError_1.default('board.notFound', http_status_codes_1.default.NOT_FOUND);
    const project = yield project_schema_1.default.findById(testCase.project);
    if (!project)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.NOT_FOUND);
    const board = yield board_schema_1.default.findOne({ name: testCase.platform, project: testCase.project });
    if (!board)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.NOT_FOUND);
    const issuesCount = yield issues_schema_1.default.countDocuments({ project });
    if (issuesCount < 0)
        throw new ApiError_1.default('issue.notFound', http_status_codes_1.default.BAD_REQUEST);
    const data = {
        key: `${project.key}-${issuesCount + 1}`,
        board: board._id,
        project: project._id,
        name: testCase.name,
        description: testCase.description || '',
        type: issue_1.IssueType.bug,
        status: issue_1.IssueStatus.design,
        linkedIssues: [testCase._id],
    };
    if (testCase.assignee)
        data.reporter = testCase.assignee;
    const issue = yield issues_schema_1.default.create(data);
    if (!issue)
        throw new ApiError_1.default('issue.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.json(issue);
});
exports.createBugIssue = createBugIssue;
//# sourceMappingURL=issues.controller.js.map