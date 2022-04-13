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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.updateUser = exports.deleteUser = exports.addUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const user_schema_1 = __importDefault(require("../schemas/user.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.create(req.body);
    if (!user)
        throw new ApiError_1.default('user.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.send(user);
});
exports.addUser = addUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const user = yield user_schema_1.default.findById(id);
    if (!user)
        throw new ApiError_1.default('user.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield user.remove();
    res.send(user);
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, username, email } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const user = yield user_schema_1.default.findById(id);
    if (!user)
        throw new ApiError_1.default('user.notFound', http_status_codes_1.default.BAD_REQUEST);
    if (name)
        user.name = name;
    if (username)
        user.username = username;
    if (email)
        user.email = email;
    yield user.save();
    res.send(user);
});
exports.updateUser = updateUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const user = yield user_schema_1.default.findById(id);
    if (!user)
        throw new ApiError_1.default('user.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(user);
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = '' } = req.query;
    const query = {};
    if (search)
        query.name = { $regex: search, $options: 'i' };
    const Users = yield user_schema_1.default.find(query);
    if (!Users)
        throw new ApiError_1.default('User.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(Users);
});
exports.getUsers = getUsers;
//# sourceMappingURL=users.controller.js.map