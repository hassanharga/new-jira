import { Schema } from 'mongoose';
import { IssueStatus, IssueType, IssueComponents } from '../constants/issue';

export interface Issue {
  name: string;
  priority: string;
  version: string;
  status: IssueStatus;
  type: IssueType;
  components: IssueComponents[];
  description: string;
  assignee: string;
  reporter: string;
  labels: string[];
  attachments: string[];
  sub: Issue[] | Schema.Types.ObjectId[];
  releaseId: string | Schema.Types.ObjectId;
  board: Schema.Types.ObjectId;
  comments: {
    user: string;
    comment: string;
  }[];
}
