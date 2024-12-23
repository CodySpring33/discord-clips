import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

// Validate environment variables at startup
const requiredEnvVars = {
  AWS_REGION: process.env.AWS_REGION ?? '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? '',
  NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? '',
} as const;

// Check for missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const s3Client = new S3Client({
  region: requiredEnvVars.AWS_REGION,
  credentials: {
    accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY,
  },
});

interface PresignedUrlOptions {
  key: string;
  contentType: string;
}

export async function createPresignedUploadUrl({ key, contentType }: PresignedUrlOptions) {
  const maxFileSize = Number(requiredEnvVars.NEXT_PUBLIC_MAX_FILE_SIZE);
  
  if (isNaN(maxFileSize)) {
    throw new Error('NEXT_PUBLIC_MAX_FILE_SIZE must be a valid number');
  }

  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: requiredEnvVars.AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, maxFileSize],
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 600, // 10 minutes
    });

    return { url, fields };
  } catch (error) {
    console.error('Failed to create presigned URL:', error);
    throw new Error('Failed to create upload URL');
  }
}

export function getPublicUrl(key: string): string {
  return `https://${requiredEnvVars.AWS_BUCKET_NAME}.s3.${requiredEnvVars.AWS_REGION}.amazonaws.com/${key}`;
} 