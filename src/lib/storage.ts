import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

// Only validate environment variables on the server side
const isServer = typeof window === 'undefined';

const requiredEnvVars = {
  AWS_REGION: process.env.AWS_REGION ?? '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? '',
  NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? '',
} as const;

// Only check environment variables on the server
if (isServer) {
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  // Log S3 configuration (without sensitive data)
  console.log('S3 Configuration:', {
    region: requiredEnvVars.AWS_REGION,
    bucket: requiredEnvVars.AWS_BUCKET_NAME,
    maxFileSize: requiredEnvVars.NEXT_PUBLIC_MAX_FILE_SIZE,
  });
}

// Initialize S3 client only on the server
const s3Client = isServer
  ? new S3Client({
      region: requiredEnvVars.AWS_REGION,
      credentials: {
        accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY,
      },
      maxAttempts: 3, // Add retry logic
    })
  : null;

interface PresignedUrlOptions {
  key: string;
  contentType: string;
}

export async function createPresignedUploadUrl({ key, contentType }: PresignedUrlOptions) {
  if (!isServer) {
    throw new Error('This function can only be called on the server');
  }

  const maxFileSize = Number(requiredEnvVars.NEXT_PUBLIC_MAX_FILE_SIZE);
  
  if (isNaN(maxFileSize)) {
    throw new Error('NEXT_PUBLIC_MAX_FILE_SIZE must be a valid number');
  }

  try {
    console.log('Creating presigned URL for:', {
      bucket: requiredEnvVars.AWS_BUCKET_NAME,
      key,
      contentType,
    });

    const { url, fields } = await createPresignedPost(s3Client!, {
      Bucket: requiredEnvVars.AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, maxFileSize],
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
        'x-amz-acl': 'public-read', // Add public-read ACL
      },
      Expires: 600, // 10 minutes
    });

    return { url, fields };
  } catch (error) {
    console.error('Failed to create presigned URL:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create upload URL: ${error.message}`);
    }
    throw new Error('Failed to create upload URL');
  }
}

export function getPublicUrl(key: string): string {
  if (!isServer) {
    throw new Error('This function can only be called on the server');
  }

  // Use path-style URL format which is more reliable
  return `https://s3.${requiredEnvVars.AWS_REGION}.amazonaws.com/${requiredEnvVars.AWS_BUCKET_NAME}/${key}`;
}

export async function deleteObject(key: string): Promise<void> {
  const s3Client = new S3Client({
    region: requiredEnvVars.AWS_REGION,
    credentials: {
      accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID,
      secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: requiredEnvVars.AWS_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error('Failed to delete object from S3:', error);
    throw error;
  }
} 