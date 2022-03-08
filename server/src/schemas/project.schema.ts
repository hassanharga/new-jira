import { Schema, model, Document } from 'mongoose';
import { tableNames } from '../constants/constants';
import { ProjectType } from '../constants/project';
import { Project } from '../types/project';

export interface ProjectTableModel extends Project, Document {}

const projectSchema = new Schema<ProjectTableModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    key: { type: String, required: true, unique: true, trim: true },
    lead: { type: Schema.Types.ObjectId, ref: tableNames.USERS, required: true },
    type: { type: String, required: true, enum: Object.values(ProjectType), default: ProjectType.software },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

projectSchema.pre('remove', async function (this: any) {
  await this.model(tableNames.BOARDS).deleteMany({ project: this._id });
});

const ProjectModel = model<ProjectTableModel>(tableNames.PROJECTS, projectSchema);

export default ProjectModel;
