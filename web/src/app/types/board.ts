import { Project } from './project';

export enum BoardNames {
  Android = 'Android',
  IOS = 'IOS',
  'UI/UX' = 'UI/UX',
  QA = 'QA',
}
export enum BoardTypes {
  Kanban = 'Kanban',
  Scrum = 'Scrum',
}

export interface Board {
  _id: string;
  name: BoardNames;
  description: string;
  type: BoardTypes;
  project: Project;
}
