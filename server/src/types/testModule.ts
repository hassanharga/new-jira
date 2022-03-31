import { Schema } from 'mongoose';

export interface TestModule {
  name: string;
  description: string;
  project: string | Schema.Types.ObjectId;
  testCases: string[] | Schema.Types.ObjectId[];
}

