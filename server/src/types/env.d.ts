declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      DB_URL: string;
      API_URL: string;
      AWS_REGION: string;
      S3_BUCKET_NAME: string;
      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
    }
  }
}

export {};
