export enum IssueType {
  release = 'release',
  story = 'story',
  bug = 'bug',
}

export const issueStatus = {
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
  status: keyof typeof issueStatus;
  type: IssueType;
  components: IssueComponents[];
  description: string;
  assignee: string;
  reporter: string;
  labels: string[];
  attachments: string[];
  sub: Issue[];
  releaseId: string;
  board: string;
  createdAt: string;
  updatedAt: string;
  comments: {
    user: string;
    comment: string;
  }[];
}
