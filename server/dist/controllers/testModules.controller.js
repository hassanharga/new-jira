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
exports.addTestCase = exports.getTestModules = exports.getTestModule = exports.deleteTestModule = exports.addTestModule = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const testModule_schema_1 = __importDefault(require("../schemas/testModule.schema"));
const testCase_schema_1 = __importDefault(require("../schemas/testCase.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const addTestModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield (yield testModule_schema_1.default.create(req.body)).populate('testCases');
    if (!module)
        throw new ApiError_1.default('module.notCreated', http_status_codes_1.default.BAD_REQUEST);
    res.send(module);
});
exports.addTestModule = addTestModule;
const deleteTestModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const module = yield testModule_schema_1.default.findById(id);
    if (!module)
        throw new ApiError_1.default('module.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield module.remove();
    res.send(module);
});
exports.deleteTestModule = deleteTestModule;
const getTestModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const module = yield testModule_schema_1.default.findById(id).populate('testCases');
    if (!module)
        throw new ApiError_1.default('module.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(module);
});
exports.getTestModule = getTestModule;
const getTestModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project } = req.query;
    if (!(0, mongoose_1.isValidObjectId)(project))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const modules = yield testModule_schema_1.default.find({ project }).populate('testCases');
    if (!modules)
        throw new ApiError_1.default('module.notFound', http_status_codes_1.default.BAD_REQUEST);
    res.send(modules);
});
exports.getTestModules = getTestModules;
const addTestCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { module } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(module))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const moduleData = yield testModule_schema_1.default.findById(module);
    if (!moduleData)
        throw new ApiError_1.default('module.notFound', http_status_codes_1.default.BAD_REQUEST);
    const testCase = yield testCase_schema_1.default.create(Object.assign(Object.assign({}, req.body), { module }));
    if (!testCase)
        throw new ApiError_1.default('testCase.notCreated', http_status_codes_1.default.BAD_REQUEST);
    moduleData.testCases.push(testCase._id);
    yield moduleData.save();
    res.send(testCase);
});
exports.addTestCase = addTestCase;
//# sourceMappingURL=testModules.controller.js.map