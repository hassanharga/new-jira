import { Schema } from 'mongoose';

type History = {
  user: string | Schema.Types.ObjectId;
  description: string;
  _id: string;
  createdAt: Date;
};

export interface Feature {
  name: string;
  description: string;
  project: string | Schema.Types.ObjectId;
  history: History[];
  drafts: History[];
}
