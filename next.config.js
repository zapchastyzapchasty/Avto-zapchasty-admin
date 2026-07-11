/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.ufs.sh' },       // UploadThing
      { protocol: 'https', hostname: 'utfs.io' },          // UploadThing (eski)
      { protocol: 'https', hostname: '**.r2.dev' },        // Cloudflare R2
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'http', hostname: 'localhost' },         // DEV /uploads
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: '192.168.1.7' },
    ],
  },
};

module.exports = nextConfig;

