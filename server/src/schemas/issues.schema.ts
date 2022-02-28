import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { IssueComponents, IssueStatus, IssueType } from '../constants/issue';
import { Issue } from '../types/issue';

export interface IssueTableModel extends Issue, Document {}

const issueSchema = new Schema<IssueTableModel>(
  {
    name: { type: String, required: true, trim: true },
    priority: { type: String, trim: true },
    version: { type: String, required: true },
    status: { type: String, enum: Object.values(IssueStatus), default: IssueStatus.design },
    type: { type: String, required: true, enum: Object.values(IssueType) },
    components: { type: [String], enum: IssueComponents },
    description: { type: String, trim: true },
    assignee: { type: String, trim: true },
    reporter: { type: String, required: true, trim: true },
    labels: { type: [String] },
    attachments: { type: [String] },
    releaseId: { type: Schema.Types.ObjectId, ref: tableNames.ISSUES },
    board: { type: Schema.Types.ObjectId, required: true },
    comments: {
      type: [
        {
          user: String,
          comment: String,
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
