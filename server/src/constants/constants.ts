export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const port = process.env.PORT || 3000;

export const aws = {
  region: `${process.env.AWS_REGION}`,
  bucket: `${process.env.S3_BUCKET_NAME}`,
  accessKeyId: `${process.env.S3_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`,
};

export const tableNames = {
  PROJECTS: 'projects',
  BOARDS: 'boards',
  ISSUES: 'issues',
  FEATURES: 'features',
  USERS: 'users',
};
