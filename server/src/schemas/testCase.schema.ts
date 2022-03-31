import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { TestCase } from '../types/testCase';

export interface ModuleTableModel extends TestCase, Document {}

const testCaseSchema = new Schema<ModuleTableModel>(
  {
    attachments: { type: [String] },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    module: { type: Schema.Types.ObjectId, ref: tableNames.MODULES, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const IssueModel = model<ModuleTableModel>(tableNames.TEST_CASES, testCaseSchema);

export default IssueModel;

