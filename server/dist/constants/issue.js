"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueComponents = exports.IssueStatus = exports.IssueType = void 0;
var IssueType;
(function (IssueType) {
    IssueType["release"] = "release";
    IssueType["story"] = "story";
    IssueType["bug"] = "bug";
    IssueType["task"] = "task";
    IssueType["test"] = "test";
})(IssueType = exports.IssueType || (exports.IssueType = {}));
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["design"] = "design";
    IssueStatus["todo"] = "todo";
    IssueStatus["inProgress"] = "inProgress";
    IssueStatus["inReview"] = "inReview";
    IssueStatus["done"] = "done";
    IssueStatus["release"] = "release";
    IssueStatus["reOpen"] = "reOpen";
})(IssueStatus = exports.IssueStatus || (exports.IssueStatus = {}));
var IssueComponents;
(function (IssueComponents) {
    IssueComponents["Android"] = "Android";
    IssueComponents["IOS"] = "IOS";
    IssueComponents["UX/UI"] = "UX/UI";
    IssueComponents["QA"] = "QA";
})(IssueComponents = exports.IssueComponents || (exports.IssueComponents = {}));
//# sourceMappingURL=issue.js.map