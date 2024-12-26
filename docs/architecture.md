# Architecture Documentation

This document outlines the architecture of Discord Clips, explaining how different parts of the system work together.

## System Overview

Discord Clips is built using a modern web stack with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │     │   AWS S3        │     │   Vercel KV     │
│   (Frontend +   │ ←── │   (Storage)     │     │   (Metadata)    │
│   API Routes)   │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Core Technologies

- **Next.js 14**: Full-stack React framework
  - App Router for routing
  - Server Components for improved performance
  - API Routes for backend functionality
  - Edge Runtime support
  
- **AWS S3**: Object storage
  - Video file storage
  - Presigned URLs for secure uploads
  - CloudFront integration (optional)

- **FFmpeg**: Video processing
  - Thumbnail generation
  - Video format conversion
  - Metadata extraction

## Key Features Implementation

### Video Upload Flow

1. Client initiates upload:
   ```typescript
   POST /api/videos/upload
   ```

2. Server generates presigned S3 URL:
   ```typescript
   const { url, fields } = await createPresignedPost(s3Client, {
     Bucket: process.env.AWS_BUCKET_NAME,
     Key: `videos/${videoId}`,
     Conditions: [
       ['content-length-range', 0, MAX_FILE_SIZE],
     ],
   });
   ```

3. Client uploads directly to S3
4. Server processes video and generates thumbnail
5. Metadata stored in Vercel KV

### Video Playback

1. Client requests video:
   ```typescript
   GET /api/videos/[id]
   ```

2. Server generates temporary URL:
   ```typescript
   const url = await getSignedUrl(s3Client, new GetObjectCommand({
     Bucket: process.env.AWS_BUCKET_NAME,
     Key: `videos/${videoId}`,
   }));
   ```

3. Client streams video directly from S3

## Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API Routes
│   ├── videos/         # Video pages
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # Base UI components
│   └── video/         # Video-related components
├── lib/               # Shared utilities
│   ├── s3.ts         # S3 client and helpers
│   ├── videos.ts     # Video processing logic
│   └── utils.ts      # General utilities
└── types/            # TypeScript types
```

## Data Flow

### Video Data Model

```typescript
interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: string;
  metadata: {
    duration: number;
    size: number;
    format: string;
  };
}
```

### State Management

- Server-side state managed through Vercel KV
- Client-side state managed with React hooks
- No global state management needed due to server components

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component for thumbnails
   - Automatic WebP conversion
   - Responsive sizes

2. **Video Delivery**
   - Chunked streaming
   - Range requests support
   - Client-side buffering

3. **Caching Strategy**
   - Static page caching
   - API route caching
   - S3 object caching

## Security Considerations

1. **Upload Security**
   - File type validation
   - Size limits
   - Virus scanning (planned)
   - Presigned URLs

2. **Access Control**
   - Temporary URLs for video access
   - Rate limiting on API routes
   - Input validation

3. **Infrastructure Security**
   - AWS IAM best practices
   - Minimal S3 bucket permissions
   - Environment variable protection

## Deployment

The application is designed to be deployed on Vercel with the following configuration:

1. **Build Settings**
   ```
   Build Command: next build
   Output Directory: .next
   Install Command: npm install
   ```

2. **Environment Variables**
   - AWS credentials
   - S3 bucket configuration
   - API keys and secrets

3. **Edge Network**
   - Vercel's global edge network
   - Automatic HTTPS
   - Asset optimization

## Monitoring and Logging

1. **Application Monitoring**
   - Vercel Analytics
   - Error tracking
   - Performance metrics

2. **Infrastructure Monitoring**
   - AWS CloudWatch
   - S3 metrics
   - API route analytics

## Future Considerations

1. **Scalability**
   - Implement video transcoding
   - Add CDN support
   - Optimize for larger files

2. **Features**
   - User authentication
   - Video sharing
   - Advanced editing

3. **Performance**
   - WebAssembly processing
   - Enhanced caching
   - Progressive loading 