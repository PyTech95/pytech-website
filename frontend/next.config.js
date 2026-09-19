/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: { REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
