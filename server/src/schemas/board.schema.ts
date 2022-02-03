import { Schema, model, Document } from 'mongoose';
import { BoardNames, BoardTypes } from '../constants/board';
import { tableNames } from '../constants/constants';
import { Board } from '../types/board';

export interface BoardTableModel extends Board, Document {}

const boardSchema = new Schema<BoardTableModel>(
  {
    name: { type: String, required: true, trim: true, enum: Object.values(BoardNames) },
    type: { type: String, required: true, trim: true, enum: Object.values(BoardTypes) },
    description: { type: String, trim: true },
    project: { type: Schema.Types.ObjectId, ref: tableNames.PROJECTS, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

boardSchema.pre('remove', async function (this: any) {
  await this.model(tableNames.ISSUES).deleteMany({ board: this._id });
});

const BoardModel = model<BoardTableModel>(tableNames.BOARDS, boardSchema);

export default BoardModel;
