import { Schema } from 'mongoose';

export interface TestCase {
  name: string;
  description: string;
  module: string | Schema.Types.ObjectId;
  attachments: string[];
}

