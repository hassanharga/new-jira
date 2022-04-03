import { Issue } from './issue';
import { User } from './user';

export interface Feature {
  _id: string;
  name: string;
  description: string;
  project: string;
  history: FeatureHistory[];
  drafts: FeatureHistory[];
}

export type FeatureHistory = {
  user: User;
  description: string;
  attachments: string[];
  uxAttachments: string[];
  release: Pick<Issue, 'version' | '_id'>;
  _id: string;
  createdAt: string | null | Date;
};
