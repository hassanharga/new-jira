import AWS from 'aws-sdk';
import { aws } from '../constants/constants';

AWS.config.update({
  region: aws.region,
  credentials: {
    accessKeyId: aws.accessKeyId,
    secretAccessKey: aws.secretAccessKey,
  },
});

export const s3 = new AWS.S3();

