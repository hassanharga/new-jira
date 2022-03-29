import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { Feature } from '../types/feature';

export interface FeatureTableModel extends Feature, Document {}

const issueSchema = new Schema<FeatureTableModel>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    project: { type: Schema.Types.ObjectId, ref: tableNames.PROJECTS, required: true },
    history: [
      {
        user: { type: Schema.Types.ObjectId, ref: tableNames.USERS, required: true },
        description: { type: String, trim: true },
        release: { type: Schema.Types.ObjectId, ref: tableNames.ISSUES },
        createdAt: { type: Date, default: new Date() },
      },
    ],
    drafts: [
      {
        user: { type: Schema.Types.ObjectId, ref: tableNames.USERS, required: true },
        description: { type: String, trim: true },
        release: { type: Schema.Types.ObjectId, ref: tableNames.ISSUES },
        createdAt: { type: Date, default: new Date() },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const IssueModel = model<FeatureTableModel>(tableNames.FEATURES, issueSchema);

export default IssueModel;

