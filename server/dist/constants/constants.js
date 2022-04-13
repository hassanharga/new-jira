"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableNames = exports.aws = exports.port = exports.isDevelopment = exports.isTest = exports.isProd = void 0;
exports.isProd = process.env.NODE_ENV === 'production';
exports.isTest = process.env.NODE_ENV === 'test';
exports.isDevelopment = process.env.NODE_ENV === 'development';
exports.port = process.env.PORT || 3000;
exports.aws = {
    region: `${process.env.AWS_REGION}`,
    bucket: `${process.env.S3_BUCKET_NAME}`,
    accessKeyId: `${process.env.S3_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`,
};
exports.tableNames = {
    PROJECTS: 'projects',
    BOARDS: 'boards',
    ISSUES: 'issues',
    FEATURES: 'features',
    USERS: 'users',
    TEST_CASES: 'testCases',
    MODULES: 'modules',
};
//# sourceMappingURL=constants.js.map