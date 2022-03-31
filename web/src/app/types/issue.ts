import { TestCase } from './testCase';
import { User } from './user';

export enum IssueType {
  release = 'release',
  story = 'story',
  bug = 'bug',
  task = 'task',
  test = 'test',
}

export enum IssuePriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum IssueStatusKeys {
  design = 'design',
  todo = 'todo',
  inProgress = 'inProgress',
  inReview = 'inReview',
  done = 'done',
  release = 'release',
  reOpen = 'reOpen',
}

export const issueStatus: Record<string, string> = {
  design: 'Design',
  todo: 'To Do',
  inProgress: 'In Progress',
  inReview: 'In Review',
  done: 'Done',
  release: 'Release',
  reOpen: 'Re Open',
};

export enum IssueComponents {
  Android = 'Android',
  IOS = 'IOS',
  'UX/UI' = 'UX/UI',
  QA = 'QA',
}

export interface Issue {
  _id: string;
  name: string;
  version: string;
  key: string;
  cbuNumber: string;
  status: keyof typeof issueStatus;
  type: IssueType;
  components: IssueComponents[];
  description: string;
  assignee: User;
  reporter: User;
  labels: string[];
  attachments: string[];
  sub: Issue[];
  releaseId: string;
  board: string;
  project: string;
  createdAt: string;
  updatedAt: string;
  testCase: TestCase;
  comments: {
    user: User;
    comment: string;
    createdAt: number;
  }[];
}
