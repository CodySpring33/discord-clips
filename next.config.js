const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['nanoid'],
  images: {
    domains: ['discord-clips-storage.s3.us-west-2.amazonaws.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src')
    };
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/videos/:id/url',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // Cache for 1 hour
          },
        ],
      },
      {
        source: '/api/videos/:id/thumbnail',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 