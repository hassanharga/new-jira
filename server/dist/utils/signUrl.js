"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUrl = void 0;
const aws_1 = require("../services/aws");
const constants_1 = require("../constants/constants");
const signUrl = (url) => {
    const Key = url.split('.com/')[1];
    const params = {
        Key,
        Bucket: constants_1.aws.bucket,
        Expires: 900000,
    };
    return aws_1.s3.getSignedUrl('getObject', params);
};
exports.signUrl = signUrl;
//# sourceMappingURL=signUrl.js.map