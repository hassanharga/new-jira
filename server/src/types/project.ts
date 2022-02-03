import { Schema } from 'mongoose';
import { ProjectType } from '../constants/project';

export interface Project {
  name: string;
  key: string;
  type: ProjectType;
  lead: string | Schema.Types.ObjectId;
  description: string;
}
