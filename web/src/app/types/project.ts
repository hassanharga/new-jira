export enum ProjectTypes {
  software = 'software',
}

export interface Project {
  _id: string;
  id: string;
  name: string;
  key: string;
  type: ProjectTypes;
  lead: string;
  description: string;
}
