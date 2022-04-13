"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const constants_1 = require("../constants/constants");
aws_sdk_1.default.config.update({
    region: constants_1.aws.region,
    credentials: {
        accessKeyId: constants_1.aws.accessKeyId,
        secretAccessKey: constants_1.aws.secretAccessKey,
    },
});
exports.s3 = new aws_sdk_1.default.S3();
//# sourceMappingURL=aws.js.map