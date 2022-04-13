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
exports.getFeatures = exports.getFeature = exports.updateFeature = exports.deleteFeature = exports.addFeature = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const issue_1 = require("../constants/issue");
const feature_schema_1 = __importDefault(require("../schemas/feature.schema"));
const issues_schema_1 = __importDefault(require("../schemas/issues.schema"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const signUrl_1 = require("../utils/signUrl");
const addFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feature = yield feature_schema_1.default.create(req.body);
    if (!feature)
        throw new ApiError_1.default('feature.notCreated', http_status_codes_1.default.BAD_REQUEST);
    const history = feature.history.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    const drafts = feature.drafts.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    feature.history = history;
    feature.drafts = drafts;
    res.send(feature);
});
exports.addFeature = addFeature;
const deleteFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const feature = yield feature_schema_1.default.findById(id);
    if (!feature)
        throw new ApiError_1.default('feature.notFound', http_status_codes_1.default.BAD_REQUEST);
    yield feature.remove();
    res.send(feature);
});
exports.deleteFeature = deleteFeature;
const updateFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, description, drafts, draftId } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const feature = yield feature_schema_1.default.findById(id);
    if (!feature)
        throw new ApiError_1.default('feature.notFound', http_status_codes_1.default.BAD_REQUEST);
    if (name)
        feature.name = name;
    if (description)
        feature.description = description;
    if (drafts && drafts.length > 0)
        feature.drafts.push(drafts[0]);
    if (draftId) {
        const draftIdx = feature.drafts.findIndex((ele) => ele._id.toString() === draftId.toString());
        if (draftIdx >= 0) {
            const releaseData = yield issues_schema_1.default.findById(feature.drafts[draftIdx].release);
            if (!releaseData)
                throw new ApiError_1.default('release.notFound', http_status_codes_1.default.BAD_REQUEST);
            if (releaseData.status !== issue_1.IssueStatus.done)
                throw new ApiError_1.default('release.opened', http_status_codes_1.default.BAD_REQUEST);
            const draft = feature.drafts.splice(draftIdx, 1)[0];
            feature.history.push(draft);
        }
    }
    yield feature.save();
    let updatedFeature = yield feature_schema_1.default.populate(feature, { path: 'drafts.user', select: 'name' });
    updatedFeature = yield feature_schema_1.default.populate(updatedFeature, { path: 'history.user', select: 'name' });
    updatedFeature = yield feature_schema_1.default.populate(updatedFeature, { path: 'drafts.release', select: 'version' });
    updatedFeature = yield feature_schema_1.default.populate(updatedFeature, { path: 'history.release', select: 'version' });
    const history = updatedFeature.history.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    const draftsData = updatedFeature.drafts.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    updatedFeature.history = history;
    updatedFeature.drafts = draftsData;
    res.send(updatedFeature);
});
exports.updateFeature = updateFeature;
const getFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    const feature = yield feature_schema_1.default.findById(id)
        .populate('history.user', 'name')
        .populate('drafts.user', 'name')
        .populate('history.release', 'version')
        .populate('drafts.release', 'version');
    if (!feature)
        throw new ApiError_1.default('feature.notFound', http_status_codes_1.default.BAD_REQUEST);
    const history = feature.history.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    const drafts = feature.drafts.map((hist) => {
        const ele = hist;
        ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
        ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
        return ele;
    });
    feature.history = history;
    feature.drafts = drafts;
    res.send(feature);
});
exports.getFeature = getFeature;
const getFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project } = req.query;
    if (!(0, mongoose_1.isValidObjectId)(project))
        throw new ApiError_1.default('errorMsg.badCredentials', http_status_codes_1.default.BAD_REQUEST);
    let features = yield feature_schema_1.default.find({ project })
        .populate('history.user', 'name')
        .populate('drafts.user', 'name')
        .populate('history.release', 'version')
        .populate('drafts.release', 'version');
    if (!features)
        throw new ApiError_1.default('feature.notFound', http_status_codes_1.default.BAD_REQUEST);
    features = features.map((feat) => {
        const feature = feat;
        const history = feature.history.map((hist) => {
            const ele = hist;
            ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
            ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
            return ele;
        });
        const drafts = feature.drafts.map((hist) => {
            const ele = hist;
            ele.attachments = ele.attachments.map((att) => (0, signUrl_1.signUrl)(att));
            ele.uxAttachments = ele.uxAttachments.map((att) => (0, signUrl_1.signUrl)(att));
            return ele;
        });
        feature.history = history;
        feature.drafts = drafts;
        return feature;
    });
    res.send(features);
});
exports.getFeatures = getFeatures;
//# sourceMappingURL=features.controller.js.map