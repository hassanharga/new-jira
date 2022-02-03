import { Schema } from 'mongoose';
import { BoardTypes, BoardNames } from '../constants/board';

export interface Board {
  name: BoardNames;
  description: string;
  type: BoardTypes;
  project: string | Schema.Types.ObjectId;
}
