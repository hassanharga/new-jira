import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { IssueComponents, IssueStatus, IssueType } from '../constants/issue';
import { Issue } from '../types/issue';

export interface IssueTableModel extends Issue, Document {}

const issueSchema = new Schema<IssueTableModel>(
  {
    name: { type: String, required: true, trim: true },
    priority: { type: String, trim: true },
    key: { type: String, trim: true, unique: true },
    cbuNumber: { type: String, trim: true },
    version: { type: String },
    status: { type: String, enum: Object.values(IssueStatus), default: IssueStatus.design },
    type: { type: String, required: true, enum: Object.values(IssueType) },
    components: { type: [String], enum: IssueComponents },
    platform: { type: String, trim: true },
    description: { type: String, trim: true },
    assignee: { type: Schema.Types.ObjectId, ref: tableNames.USERS, trim: true },
    reporter: { type: Schema.Types.ObjectId, ref: tableNames.USERS, required: true, trim: true },
    labels: { type: [String] },
    attachments: { type: [String] },
    releaseId: { type: Schema.Types.ObjectId, ref: tableNames.ISSUES },
    module: { type: Schema.Types.ObjectId, ref: tableNames.MODULES },
    testCase: { type: Schema.Types.ObjectId, ref: tableNames.TEST_CASES },
    board: { type: Schema.Types.ObjectId, ref: tableNames.BOARDS, required: true },
    project: { type: Schema.Types.ObjectId, ref: tableNames.PROJECTS, required: true },
    comments: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: tableNames.USERS, required: true },
          comment: String,
          createdAt: { type: Date, default: new Date() },
          _id: false,
        },
      ],
    },
    sub: {
      type: [Schema.Types.ObjectId],
      ref: tableNames.ISSUES,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

issueSchema.pre('remove', async function (this: any) {
  await this.model(tableNames.ISSUES).deleteMany({ releaseId: this._id });
});

const IssueModel = model<IssueTableModel>(tableNames.ISSUES, issueSchema);

export default IssueModel;

