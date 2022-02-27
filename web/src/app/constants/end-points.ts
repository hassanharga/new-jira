export type ServiceData = {
  url: string;
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

export type ServiceKeys = keyof typeof services;

export const services = {
  getProjects: {
    url: '/projects',
    type: 'GET',
  },
  getProjectBoards: {
    url: '/boards?project={project}',
    type: 'GET',
  },
  addBoard: {
    url: '/boards',
    type: 'POST',
  },
  addProject: {
    url: '/projects',
    type: 'POST',
  },
  getBoardIssues: {
    url: '/issues/{id}',
    type: 'GET',
  },
  addIssue: {
    url: '/issues',
    type: 'POST',
  },
} as const;
