import { Schema } from 'mongoose';

type History = {
  user: string | Schema.Types.ObjectId;
  description: string;
  _id: string;
  release: string | Schema.Types.ObjectId;
  createdAt: Date;
  attachments: string[];
  uxAttachments: string[];
};

export interface Feature {
  name: string;
  description: string;
  project: string | Schema.Types.ObjectId;
  history: History[];
  drafts: History[];
}

