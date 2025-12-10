/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'fastly.picsum.photos',
      'i.pinimg.com',
      'embla.com',
      'example.com',
      'storage.googleapis.com',
      'picsum.photos',
      'media.istockphoto.com',
      'flagsapi.com',
      'ryzer-v2.s3.ap-south-1.amazonaws.com',
      'www.pexels.com',
      'www.ryzer.app',
      'ownmali-v2.s3.af-south-1.amazonaws.com',
      'smile-results-prod.s3.us-west-2.amazonaws.com'
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 