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
exports.getBoards = exports.getBoard = exports.updateBoard = exports.deleteBoard = exports.addBoard = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const board_schema_1 = __importDefault(require("../schemas/board.schema"));
const project_schema_1 = __importDefault(require("../schemas/project.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project } = req.body;
    if (!project || !(0, mongoose_1.isValidObjectId)(project))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const projectData = yield project_schema_1.default.findById(project.toString());
    if (!projectData)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.BAD_REQUEST);
    const existedBoard = yield board_schema_1.default.findOne({ project: project.toString(), name: req.body.name.trim() });
    if (existedBoard)
        throw new ApiError_1.default('board.exists', http_status_codes_1.default.BAD_REQUEST);
    const board = yield board_schema_1.default.create(req.body);
    if (!board)
        throw new ApiError_1.default('board.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.send(board);
});
exports.addBoard = addBoard;
const deleteBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const board = yield board_schema_1.default.findById(id);
    if (!board)
        throw new ApiError_1.default('board.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield board.remove();
    res.send(board);
});
exports.deleteBoard = deleteBoard;
const updateBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id, project } = _a, data = __rest(_a, ["id", "project"]);
    if (!project || !id || !(0, mongoose_1.isValidObjectId)(id) || !(0, mongoose_1.isValidObjectId)(project))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const projectData = yield project_schema_1.default.findById(project.toString());
    if (!projectData)
        throw new ApiError_1.default('project.notFound', http_status_codes_1.default.BAD_REQUEST);
    const existedBoard = yield board_schema_1.default.findOne({ project: project.toString(), name: req.body.name.trim() });
    if (existedBoard && existedBoard._id.toString() !== id.toString())
        throw new ApiError_1.default('board.exists', http_status_codes_1.default.BAD_REQUEST);
    const board = yield board_schema_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!board)
        throw new ApiError_1.default('board.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(board);
});
exports.updateBoard = updateBoard;
const getBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const board = yield board_schema_1.default.findById(id);
    if (!board)
        throw new ApiError_1.default('board.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(board);
});
exports.getBoard = getBoard;
const getBoards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project } = req.query;
    const boards = yield board_schema_1.default.find({ project: project.toString() }).populate('project');
    if (!boards)
        throw new ApiError_1.default('board.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.send(boards);
});
exports.getBoards = getBoards;
//# sourceMappingURL=board.controller.js.map