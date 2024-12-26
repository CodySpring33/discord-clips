# Getting Started with Discord Clips

This guide will help you set up Discord Clips locally for development.

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- AWS Account (for S3 storage)
- FFmpeg installed on your system

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/discord-clips.git
cd discord-clips
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Development Setup

### AWS S3 Configuration

1. Create an S3 bucket in your AWS account
2. Configure CORS for your bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000"],
        "ExposeHeaders": []
    }
]
```

3. Create an IAM user with appropriate S3 permissions
4. Add the credentials to your `.env.local` file

### FFmpeg Setup

FFmpeg is required for video processing and thumbnail generation. Make sure it's installed and accessible in your system's PATH.

- **Windows**: Install via [chocolatey](https://chocolatey.org/): `choco install ffmpeg`
- **macOS**: Install via [homebrew](https://brew.sh/): `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

## Project Structure

```
discord-clips/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions and shared logic
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── docs/            # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

- Review the [Architecture Documentation](./architecture.md)
- Check out the [API Reference](./api-reference.md)
- Explore the [Component Library](./components.md) 