import crypto from 'crypto';
import { RequestHandler } from 'express';
import * as MimeType from 'mime-types';
import { aws } from '../constants/constants';
import { s3 } from '../services/aws';

export const signAttachments: RequestHandler = async (req, res) => {
  const { fileType } = req.query;
  const fileName = `${new Date().getTime()}.${fileType}`;
  const expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();

  const policy = {
    expiration,
    conditions: [
      { bucket: aws.bucket },
      { key: fileName },
      { acl: 'public-read' },
      ['starts-with', '$Content-Type', ''],
    ],
  };

  const policyBase64 = Buffer.from(JSON.stringify(policy), 'utf8').toString('base64');

  const signature = crypto.createHmac('sha1', aws.secretAccessKey).update(policyBase64).digest('base64');

  res.json({
    bucket: aws.bucket,
    awsKey: aws.accessKeyId,
    policy: policyBase64,
    signature,
    fileName,
  });
};

export const createPreSignedUrl: RequestHandler = async (req, res) => {
  const { fileType } = req.query as { fileType: string };
  const type = MimeType.contentType(fileType) || '';
  const ext = MimeType.extension(type);

  const params = {
    Key: `${new Date().getTime()}.${ext}`,
    Bucket: aws.bucket,
    Expires: 300000, // 5 minutes
    ContentType: type,
  };

  const url = s3.getSignedUrl('putObject', params);

  res.json({ url });
};

export const signUrl: RequestHandler = async (req, res) => {
  const { url } = req.query as { url: string };
  const Key = url.split('.com/')[1];

  const params = {
    Key,
    Bucket: aws.bucket,
    Expires: 900000, // 15 minutes
  };

  const newUrl = s3.getSignedUrl('getObject', params);

  res.json({ url: newUrl });
};

