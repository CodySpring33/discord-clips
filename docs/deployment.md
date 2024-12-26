# Deployment Guide

This guide explains how to deploy Discord Clips to production.

## Prerequisites

- Vercel account
- AWS account
- Domain name (optional)
- Node.js 18+ installed locally

## Step 1: AWS Setup

### S3 Bucket Configuration

1. Create a new S3 bucket:
   - Go to AWS Console > S3
   - Create bucket with a unique name
   - Enable versioning (recommended)
   - Block all public access

2. Configure CORS policy:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://your-domain.com"
        ],
        "ExposeHeaders": []
    }
]
```

3. Create IAM user:
   - Create new IAM user with programmatic access
   - Attach policy with minimal required permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name/*",
                "arn:aws:s3:::your-bucket-name"
            ]
        }
    ]
}
```

## Step 2: Vercel Setup

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Configure project:

```bash
vercel
```

4. Set environment variables in Vercel:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION
   - AWS_BUCKET_NAME
   - NEXT_PUBLIC_APP_URL

## Step 3: Deploy

### Development Deployment

```bash
vercel
```

### Production Deployment

```bash
vercel --prod
```

## Step 4: Domain Setup (Optional)

1. Add custom domain in Vercel dashboard
2. Configure DNS settings
3. Update CORS policy in S3 with new domain

## Step 5: Post-Deployment

### Verify Installation

1. Test video upload
2. Check thumbnail generation
3. Verify video playback
4. Confirm delete functionality

### Monitor Performance

1. Set up Vercel Analytics
2. Configure AWS CloudWatch
3. Set up error tracking

## Environment Variables

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deployment Checklist

- [ ] AWS S3 bucket created and configured
- [ ] IAM user created with correct permissions
- [ ] Environment variables set in Vercel
- [ ] CORS policy configured
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Monitoring tools configured
- [ ] Post-deployment tests passed

## Troubleshooting

### Common Issues

1. **S3 Upload Errors**
   - Check CORS configuration
   - Verify IAM permissions
   - Confirm environment variables

2. **Video Processing Issues**
   - Verify FFmpeg installation
   - Check server memory limits
   - Review file size limits

3. **Domain Issues**
   - Verify DNS propagation
   - Check SSL certificate
   - Confirm CORS settings

## Scaling Considerations

1. **Performance**
   - Enable Vercel Edge Functions
   - Configure S3 Transfer Acceleration
   - Implement CDN if needed

2. **Cost Optimization**
   - Monitor S3 usage
   - Configure lifecycle policies
   - Optimize video storage

3. **Maintenance**
   - Regular dependency updates
   - Security patches
   - Backup strategy

## Security Best Practices

1. **Access Control**
   - Use minimal IAM permissions
   - Rotate access keys regularly
   - Enable MFA for AWS users

2. **Data Protection**
   - Enable S3 encryption
   - Use secure environment variables
   - Regular security audits

3. **Monitoring**
   - Set up alerts for unusual activity
   - Monitor API usage
   - Track error rates 