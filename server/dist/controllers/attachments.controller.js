"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signUrl = exports.createPreSignedUrl = exports.signAttachments = void 0;
const crypto_1 = __importDefault(require("crypto"));
const MimeType = __importStar(require("mime-types"));
const constants_1 = require("../constants/constants");
const aws_1 = require("../services/aws");
const signUrl_1 = require("../utils/signUrl");
const signAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileType } = req.query;
    const fileName = `${new Date().getTime()}.${fileType}`;
    const expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
    const policy = {
        expiration,
        conditions: [
            { bucket: constants_1.aws.bucket },
            { key: fileName },
            { acl: 'public-read' },
            ['starts-with', '$Content-Type', ''],
        ],
    };
    const policyBase64 = Buffer.from(JSON.stringify(policy), 'utf8').toString('base64');
    const signature = crypto_1.default.createHmac('sha1', constants_1.aws.secretAccessKey).update(policyBase64).digest('base64');
    res.json({
        bucket: constants_1.aws.bucket,
        awsKey: constants_1.aws.accessKeyId,
        policy: policyBase64,
        signature,
        fileName,
    });
});
exports.signAttachments = signAttachments;
const createPreSignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileType } = req.query;
    const type = MimeType.contentType(fileType) || '';
    const ext = MimeType.extension(type);
    const params = {
        Key: `${new Date().getTime()}.${ext}`,
        Bucket: constants_1.aws.bucket,
        Expires: 300000,
        ContentType: type,
    };
    const url = aws_1.s3.getSignedUrl('putObject', params);
    res.json({ url });
});
exports.createPreSignedUrl = createPreSignedUrl;
const signUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    const newUrl = (0, signUrl_1.signUrl)(url);
    res.json(newUrl);
});
exports.signUrl = signUrl;
//# sourceMappingURL=attachments.controller.js.map