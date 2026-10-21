/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // serve AVIF/WebP where the browser supports them (much smaller than JPEG)
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
