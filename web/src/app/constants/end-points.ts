export type ServiceData = {
  url: string;
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

export type ServiceKeys = keyof typeof services;

export const services = {
  getSignedUrl: { url: '/attachments', type: 'GET' },
  getUsers: { url: '/users', type: 'GET' },
  getUser: { url: '/users/{id}', type: 'GET' },
  getProjects: { url: '/projects', type: 'GET' },
  addProject: { url: '/projects', type: 'POST' },
  getProjectBoards: { url: '/boards', type: 'GET' },
  addBoard: { url: '/boards', type: 'POST' },
  getBoardIssues: { url: '/issues/board/{id}', type: 'GET' },
  getIssueDetails: { url: '/issues/{id}', type: 'GET' },
  addIssue: { url: '/issues', type: 'POST' },
  updateIssue: { url: '/issues', type: 'PUT' },
  addTestIssues: { url: '/issues/testIssue', type: 'POST' },
  getProjectFeatures: { url: '/features', type: 'GET' },
  addFeature: { url: '/features', type: 'POST' },
  updateFeature: { url: '/features', type: 'PUT' },
  getProjectModules: { url: '/modules', type: 'GET' },
  addModule: { url: '/modules', type: 'POST' },
  addTestCase: { url: '/modules/{module}/testCase', type: 'POST' },
} as const;
