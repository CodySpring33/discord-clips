import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function createPresignedUploadUrl(key: string, contentType: string) {
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Conditions: [
      ['content-length-range', 0, Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE)],
      ['starts-with', '$Content-Type', contentType],
    ],
    Fields: {
      'Content-Type': contentType,
    },
    Expires: 600, // 10 minutes
  });

  return { url, fields };
}

export function getPublicUrl(key: string) {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
} 