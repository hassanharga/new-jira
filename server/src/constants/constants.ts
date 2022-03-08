export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const port = process.env.PORT || 3000;

export const tableNames = {
  PROJECTS: 'projects',
  BOARDS: 'boards',
  ISSUES: 'issues',
  FEATURES: 'features',
  USERS: 'users',
};
