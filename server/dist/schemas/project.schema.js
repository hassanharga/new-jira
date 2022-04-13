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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../constants/constants");
const project_1 = require("../constants/project");
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    key: { type: String, required: true, unique: true, trim: true },
    lead: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.USERS, required: true },
    type: { type: String, required: true, enum: Object.values(project_1.ProjectType), default: project_1.ProjectType.software },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
projectSchema.pre('remove', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.model(constants_1.tableNames.BOARDS).deleteMany({ project: this._id });
    });
});
const ProjectModel = (0, mongoose_1.model)(constants_1.tableNames.PROJECTS, projectSchema);
exports.default = ProjectModel;
//# sourceMappingURL=project.schema.js.map