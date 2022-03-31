import { s3 } from '../services/aws';
import { aws } from '../constants/constants';

export const signUrl = (url: string) => {
  const Key = url.split('.com/')[1];

  const params = {
    Key,
    Bucket: aws.bucket,
    Expires: 900000, // 15 minutes
  };

  return s3.getSignedUrl('getObject', params);
};
