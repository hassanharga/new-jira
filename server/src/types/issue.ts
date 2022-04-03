import { Schema } from 'mongoose';
import { IssueStatus, IssueType, IssueComponents } from '../constants/issue';
import { TestCase } from './testCase';

export interface Issue {
  name: string;
  priority: string;
  key: string;
  cbuNumber: string;
  version: string;
  status: IssueStatus;
  type: IssueType;
  components: IssueComponents[];
  module: string | Schema.Types.ObjectId;
  platform: string;
  description: string;
  testCase: string | Schema.Types.ObjectId | TestCase;
  assignee: string | Schema.Types.ObjectId;
  reporter: string | Schema.Types.ObjectId;
  labels: string[];
  attachments: string[];
  sub: Issue[] | Schema.Types.ObjectId[];
  releaseId: string | Schema.Types.ObjectId;
  board: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  comments: {
    user: string | Schema.Types.ObjectId;
    comment: string;
  }[];
}

