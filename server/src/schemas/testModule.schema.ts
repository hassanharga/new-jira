import { Document, model, Schema } from 'mongoose';
import { tableNames } from '../constants/constants';
import { TestModule } from '../types/testModule';

export interface ModuleTableModel extends TestModule, Document {}

const testModuleSchema = new Schema<ModuleTableModel>(
  {
    testCases: {
      type: [Schema.Types.ObjectId],
      ref: tableNames.TEST_CASES,
    },
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    project: { type: Schema.Types.ObjectId, ref: tableNames.PROJECTS, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const IssueModel = model<ModuleTableModel>(tableNames.MODULES, testModuleSchema);

export default IssueModel;

