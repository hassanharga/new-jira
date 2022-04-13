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
exports.getProjects = exports.getProject = exports.updateProject = exports.deleteProject = exports.addProject = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const project_schema_1 = __importDefault(require("../schemas/project.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.default.create(req.body);
    if (!project)
        throw new ApiError_1.default('project.notCreated', http_status_codes_1.default.BAD_REQUEST);
    const sentProject = yield project_schema_1.default.populate(project, { path: 'lead', select: 'name' });
    res.send(sentProject);
});
exports.addProject = addProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const project = yield project_schema_1.default.findById(id);
    if (!project)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield project.remove();
    res.send(project);
});
exports.deleteProject = deleteProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id } = _a, data = __rest(_a, ["id"]);
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const project = yield project_schema_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!project)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(project);
});
exports.updateProject = updateProject;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const project = yield project_schema_1.default.findById(id).populate('lead', 'name');
    if (!project)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(project);
});
exports.getProject = getProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = '' } = req.query;
    const query = {};
    if (search)
        query.name = { $regex: search, $options: 'i' };
    const projects = yield project_schema_1.default.find(query).populate('lead', 'name');
    if (!projects)
        throw new ApiError_1.default('project.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.send(projects);
});
exports.getProjects = getProjects;
//# sourceMappingURL=project.controller.js.map