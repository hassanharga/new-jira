import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { User } from '../types/user';

export interface UserTableModel extends User, Document {}

const issueSchema = new Schema<UserTableModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const IssueModel = model<UserTableModel>(tableNames.USERS, issueSchema);

export default IssueModel;
